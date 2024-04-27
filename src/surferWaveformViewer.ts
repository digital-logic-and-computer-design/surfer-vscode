import * as vscode from 'vscode';

export class SurferWaveformViewerEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new SurferWaveformViewerEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(SurferWaveformViewerEditorProvider.viewType, provider);
		return providerRegistration;
	}

	private static readonly viewType = 'surfer.waveformViewer';

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	// Called when the Waveform Viewer is opened
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {

		// Setup initial content for the webview
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		// This will probably need to take a document as an arguement
		webviewPanel.webview.html = await this.getHtmlForWebview(webviewPanel.webview);
	}

	// Get the static html used for the editor webviews.
	private async getHtmlForWebview(webview: vscode.Webview): Promise<string> {

		// Get path to resource on disk
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

		return html;
	}

	private replaceAll(input: string, search: string, replacement: string): string {
		return input.replace(new RegExp(search, 'g'), replacement);
	}
}