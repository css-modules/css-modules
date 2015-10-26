# Change Log

This document lists the important changes to [css-modules][css-modules-repo].

Please note:

  - This document is (_loosely_) formatted according to 
    the guidelines presented in [Keep A CHANGELOG][keep-a-changelog].
  - This document does _not_ follow [Semantic Versioning][semver].<br>
    Currently, a “version” simply consists of a `«YEAR»-«MONTH»` combination.


<!-- 

Group changes to describe their impact on the project, as follows:

  - `Added`         for new features
  - `Changed`       for changes in existing functionality
  - `Deprecated`    for once-stable features removed in upcoming releases
  - `Removed`       for deprecated features removed in this release
  - `Fixed`         for any bug fixes
  - `Security`      for encouraging users to upgrade in case of vulnerabilities
  - `Miscellaneous` (only use as a last resort!) for items that don't fit into 
                    the above categories

-->

=====

## [UNRELEASED]

- **TODO**


## [2015-06]

### Added
- PostCSS transformations to tranform CSS Modules into a intermediate format (ICSS)
- Spec for ICSS as common implementation format for multiple module systems by @geelen
- Implementation for jspm by @geelen and @guybedford
- Implementation for browserify by @joshwnj, @joshgillies and @markdalgleish

### Changed
- `extends` renamed to `composes`
- webpack's css-loader implementation updated to latest spec by @sokra



## [2015-05]

### Added
- First CSS Modules spec document and github organization with @sokra, @markdalgleish and @geelen
- `extends` feature in css-loader allow to compose local or imported class names by @sokra

### Changed
- `postcss-local-scope` enables `local scope` by default (see [blog post](https://medium.com/seek-ui-engineering/the-end-of-global-css-90d2a4a06284)) by @markdalgleish



## 2015-04

### Added
- `placeholders` feature in css-loader (webpack) allows local scoped selectors (later renamed to `local scope`) by @sokra


<!--
  Release Links
-->
<!--
  More on GitHub comparison URLs:    
  https://help.github.com/articles/comparing-commits-across-time/
-->
[UNRELEASED]: https://github.com/css-modules/css-modules/compare/master@{2015-07-01}...master
[2015-06]:    https://github.com/css-modules/css-modules/compare/master@{2015-06-01}...master@{2015-07-01}
[2015-05]:    https://github.com/css-modules/css-modules/compare/master@{2015-05-01}...master@{2015-06-01}
<!-- [2015-04]:    (Not yet on GitHub)  -->


<!-- 
    Other Links
-->
[css-modules-repo]: https://github.com/css-modules/css-modules
[keep-a-changelog]: http://keepachangelog.com
[semver]:           http://semver.org
