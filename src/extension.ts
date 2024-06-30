import * as vscode from 'vscode';
import { SurferWaveformViewerEditorProvider } from './surferWaveformViewer';

export function activate(context: vscode.ExtensionContext) {
	console.log('Surfer has been activated!');
	context.subscriptions.push(SurferWaveformViewerEditorProvider.register(context))

	let disposable = vscode.commands.registerCommand('surfer.refresh', () => {
		// Find all surfer views
		SurferWaveformViewerEditorProvider.refresh();
	});
}