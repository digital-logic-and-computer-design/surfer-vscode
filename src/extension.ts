import * as vscode from 'vscode';
import { SurferWaveformViewerEditorProvider } from './surferWaveformViewer';

export function activate(context: vscode.ExtensionContext) {
	console.log('Surfer has been activated 4!');
	context.subscriptions.push(SurferWaveformViewerEditorProvider.register(context))


	let disposable = vscode.commands.registerCommand('surfer.refresh', () => {
		// Find all surfer views
		console.log("Refreshing")
		vscode.workspace.textDocuments.forEach(document => {
			if(document.fileName.endsWith(".vcd")) {
				console.log("Refreshing " + document.uri.toString())
				console.log(document)
			}
		}	);
		SurferWaveformViewerEditorProvider.refresh();
		console.log("Done refreshing")	
	});
}