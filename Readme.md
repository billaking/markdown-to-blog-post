# Markdown to blog post

This plugin allows you to convert markdown files to a structure where you can take the body and past it directly into a blog post in a CMS such as WordPress or Drupal. It is designed to work with the [Obsidian](https://obsidian.md/) note-taking app.

## Installation

1. Extract the zip file into your vault's plugins folder: `<vault>/.obsidian/plugins/`
2. Go to settings and enable the plugin.

## Usage

This plugin allows you to convert markdown files to a structure where you can take the body and past it directly into a blog post in a CMS such as WordPress or Drupal. It will convert a single markdown file. 

**Choose the markdown file you want to convert to a blog post and run the command or press the button**

The output of the conversion is a html structure without the <html>, <head>, <body> tags, so you can post directly to your blog. There are two ways to use this plugin:

1. **Convert the note by running a command**: Open the note you want to convert and run the command "Markdown to blog post". 
2. **Convert the note by pressing the globe button**: Open the note you want to convert and press the globe button on the menu bar. 

## Feature list

- [x] Convert markdown to blog post html structure.
- [x] Add configuration options to customize the output to a source path.
- [x] Get the input for the source path from the user and set it as a default.
- [x] If the file exists increment and post the new name with a variation at the end of the file before the file extension.
- [x] Ignore frontmatter when converting the markdown to a blog post.
- [ ] Follow the links in the root document and convert them to the blog post structure.
  - [ ] Provide a configuration option to set a `number` that tells the pointer how deep to traverse the links in order to create new documents
  - [ ] Add a configuration option to set the output path.
  - [ ] Check if the directory exists and create it if it doesn't.
  - [ ] Check if the files exists and prompt the user to overwrite or increment the file name.
  - [ ] Make sure the plugin put all the files into a single directory as separate html files.


## Contact me

If you have any questions or suggestions, feel free to contact me at [https://www.billaking.com](https://www.billaking.com).