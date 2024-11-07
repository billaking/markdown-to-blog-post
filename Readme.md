# Markdown to blog post

This plugin allows you to convert markdown files to a structure where you can take the body and past it directly into a blog post in a CMS such as WordPress or Drupal. It is designed to work with the [Obsidian](https://obsidian.md/) note-taking app.

## Install dependencies

```bash
npm install
```

## Build

```bash
npm run build
```

## Run

```bash
npm run start
```


## Installation

1. Extract the zip file into your vault's plugins folder: `<vault>/.obsidian/plugins/`
2. Go to settings and enable the plugin.

## Usage

The output of the conversion is a html structure without the <html>, <head>, <body> tags, so you can post directly to your blog. There are two ways to use this plugin:

1. **Convert the note by running a command**: Open the note you want to convert and run the command "Markdown to blog post". 
2. **Convert the note by pressing the globe button**: Open the note you want to convert and press the globe button on the menu bar. 

## Feature list

- [x] Convert markdown to blog post html structure.
- [x] Add configuration options to customize the output to a source path.
- [ ] Get the input for the source path from the user and set it as a default.
- [ ] If the file exists increment and post the new name with a variation at the end of the file before the file extension.


## Contact me

If you have any questions or suggestions, feel free to contact me and report bugs at [https://github.com/billaking](https://github.com/billaking).