# Contributing to Tenso

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Tenso. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/1/4/code-of-conduct). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Tenso. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Tenso, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Explain why this enhancement would be useful** to most Tenso users.

### Pull Requests

The process described here has several goals:

- Maintain Tenso's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Tenso

Please follow these steps to have your contribution considered by the maintainers:

1.  **Fork the repository** and create your branch from `main`.
2.  **Clone the repository** to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/amazing-feature`.
4.  **Make your changes** and commit them with a clear message. We follow [Conventional Commits](https://www.conventionalcommits.org/).
    - `feat: add new payment provider`
    - `fix: resolve hydration error in navbar`
    - `docs: update readme with screenshots`
5.  **Push your changes** to your fork: `git push origin feature/amazing-feature`.
6.  **Open a Pull Request** against the `main` branch of the original repository.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use `const` for all of your references; avoid using `var`.
- Use `interface` for public API definitions and `type` for internal types.
- Use `async/await` over `Promise.then`.
- Ensure all new code is fully typed.

## Development Setup

1.  **Clone the repo**: `git clone https://github.com/azharpratama/tenso.git`
2.  **Install dependencies**:
    - `cd web && npm install`
    - `cd forwarder && npm install`
3.  **Setup Environment**: `cp .env.example .env`
4.  **Run Services**:
    - `cd forwarder && npm start`
    - `cd web && npm run dev`

Happy coding! 🚀
