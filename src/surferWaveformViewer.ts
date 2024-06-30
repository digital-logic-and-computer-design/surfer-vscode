import * as vscode from 'vscode';
export class SurferWaveformViewerEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		console.log("Registering SurferWaveformViewerEditorProvider")
		const provider = new SurferWaveformViewerEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(
			SurferWaveformViewerEditorProvider.viewType,
			provider,
			{
				webviewOptions: {
					retainContextWhenHidden: true,
				}
			});

		return providerRegistration;
	}

	private static readonly viewType = 'surfer.waveformViewer';
	private static webViewPanel: vscode.WebviewPanel;
	private static document: vscode.TextDocument;
	private static instance: SurferWaveformViewerEditorProvider;

	public static async refresh() {
		console.log(SurferWaveformViewerEditorProvider.webViewPanel);
		SurferWaveformViewerEditorProvider.webViewPanel.webview.html = "";
	    SurferWaveformViewerEditorProvider.webViewPanel.webview.html = await SurferWaveformViewerEditorProvider.instance.getHtmlForWebview(SurferWaveformViewerEditorProvider.webViewPanel.webview, SurferWaveformViewerEditorProvider.document);
		//	  	await SurferWaveformViewerEditorProvider.webView.webview.postMessage("refresh");
	}

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	// Called when the Waveform Viewer is opened
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		console.log("Resolving custom text editor")
		SurferWaveformViewerEditorProvider.webViewPanel = webviewPanel;
		SurferWaveformViewerEditorProvider.document = document;
		SurferWaveformViewerEditorProvider.instance = this;
		// Add the folder that the document lives in as a localResourceRoot
		const uri = document.uri.toString();
		const pathComponents = uri.split('/');
		const fileName = pathComponents.pop();
		const dirPath = pathComponents.join('/');

		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.context.extensionUri, 'surfer'),
				vscode.Uri.parse(dirPath, true)
			]
		};

		webviewPanel.webview.html = await this.getHtmlForWebview(webviewPanel.webview, document);
	}

	// Get the static html used for the editor webviews.
	private async getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): Promise<string> {
		console.log("Getting html for webview")
		// Read index.html from disk
		const indexPath = vscode.Uri.joinPath(this.context.extensionUri, 'surfer', 'index.html');
		const contents = await vscode.workspace.fs.readFile(indexPath)

		// Get WebView URIs
		const manifestJSONUriString = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'surfer', 'manifest.json')).toString();

		const surferBGWASMUriString = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'surfer', 'surfer_bg.wasm')).toString();

		const surferJSUriString = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'surfer', 'surfer.js')).toString();

		const swJSUriString = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'surfer', 'sw.js')).toString();

		// Replace local paths with paths derived from WebView URIs
		let html = new TextDecoder().decode(contents);
		html = this.replaceAll(html, "./manifest.json", manifestJSONUriString);
		html = this.replaceAll(html, "./surfer_bg.wasm", surferBGWASMUriString);
		html = this.replaceAll(html, "./surfer.js", surferJSUriString);
		html = this.replaceAll(html, "./sw.js", swJSUriString)

		// Get the URI of the document that the user has selected, set window.query_string to it
		const documentUri = webview.asWebviewUri(document.uri).toString();
		const query_string = `?load_url=${documentUri}&amp;startup_commands=toggle_menu`;
		html = this.replaceAll(html, "window.query_string = null;", `window.query_string = "${query_string}"`);

		return html;
	}

	private replaceAll(input: string, search: string, replacement: string): string {
		return input.replace(new RegExp(search, 'g'), replacement);
	}
}