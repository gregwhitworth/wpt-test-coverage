# WPT-Test-Coverage

Gives a rough test coverage based on `<link rel="help" href="<speclink>"`.
This will currently provide the unique spec links within the tests.
It will recursively look through the folder and subfolders.

## Output to file

It by default just prints into the console, so you can output it using the normal
CLI commands such as:

    wptcoverage -f .\ > D:\test-coverage.txt

## Install
    npm install -g wptcoverage

## Usage
    wptcoverage -f <file directory> -t <link to TR version of spec>

## Contribution/Issues

Feel free to help out or file issues on [Github](https://github.com/gregwhitworth/wpt-test-coverage)

## License
Copyright (c) 2017 Greg Whitworth
Licensed under the MIT license.
