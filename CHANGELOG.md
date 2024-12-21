# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## [1.3.0] - 2024-12-21

### Added

- The option to provide a single regular expression pattern as a string or an array of strings. This allows ignoring items that match the specified pattern(s). Example: `'package-[a-z]+'` or `['package-[a-z]+', 'node-[0-9]+']`.

## [1.2.0] - 2024-08-05

### Added

- The ability to extend the default list of lowercase words.
- Logic to handle non-Latin characters.
