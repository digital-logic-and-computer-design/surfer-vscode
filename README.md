# Surfer VS Code Extension

This extension allows you to use the [Surfer](https://surfer-project.org/) waveform viewer within VS Code.

## Features

Just install the extension and open a `.vcd` file!

![](https://gitlab.com/surfer-project/surfer-vscode/-/raw/main/screenshot.png)

This extension is a port of the version of Surfer that runs in a web browser, which you can try [here](https://app.surfer-project.org/). As this extension also runs Surfer in a browser, it is subject to the same restrictions as the online version - some features are missing, and it won't be as fast as the desktop version due to a lack of multithreading support.

## Known Issues

Installing this extension alongside other extensions that open `.vcd` files will likely cause trouble. If opening a `.vcd` file doesn't load Surfer, then check to make sure that no other waveform viewer extensions are installed in VS Code. If that doesn't work, then feel free to open an issue on our [Gitlab](https://gitlab.com/surfer-project/surfer-vscode)!

## Release Notes

### 0.1.0
- Initial Release
