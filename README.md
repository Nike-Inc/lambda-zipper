# lambda-zipper

Zip up your node lambda code and production dependencies without pruning node_modules

# Installation

Install with npm

```
npm install lambda-zipper -g
```

# CLI Docs

This tool uses commands for each action. If you installed it globally, the format is

```
lambda-zipper [command] [...options]
```

## Build

```
package lambda with production dependencies

Options:
  --version          Show version number                               [boolean]
  --help             Show help                                         [boolean]
  -f, --files        Files/Directories to include in the zip output
                                                              [array] [required]
  -i, --ignore       Files/Directories to exclude from the the zip output
                                                                         [array]
  -o, --output       Name of the zip file to write to        [string] [required]
  -w, --working-dir  path to the root directory of the module. Will set the $CWD
                     before executing command.                          [string]
  -r, --root         Include "files" folders in root of archive. If false,
                     folders will be flattened so that contents, but not the
                     folders themselves, are in the root.
                                                      [boolean] [default: false]
```

**Example**

```
lambda-zipper build -f src -o ./build/test.zip
```
