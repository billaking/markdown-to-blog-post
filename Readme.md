# Markdown to blog post

This plugin will convert a obsidian markdown file to html for pasting into a blog post or into frontmatter to display in a dataview table.

## Installation

1. Extract the zip file into your vault's plugins folder: `<vault>/.obsidian/plugins/`
2. The download does not have the `node_modules` folder. You will need to run `npm install` in the plugin folder to install the dependencies.
3. You will need to have the `obsidian-dataview` plugin installed to use the html/markdown mix format. see [[Tutorial: Using the convert-note-to-html-html-markdown-mix with dataview]] for more information.
2. Go to settings and enable the plugin.

## Usage

The output of the conversion is a html structure without the <html>, <head>, <body> tags, so you can post directly to your blog. There are two ways to use this plugin:

1. **Convert the note by running a command**: Open the note you want to convert and run the command "Markdown to blog post". 
2. **Convert the note by pressing the icon button**: Open the note you want to convert and press the globe button on the menu bar. 

## Feature list

- [x] Converts a single obsidian note into raw html. The output is a html structure without the `<html>, <head>, <body>` tags.
- [x] Converts a single obsidian note into a html/markdown mix format to display content as html in frontmatter properties for dataview tables.
- [x] Customize the output of link and directory source paths.
- [x] To prevent overwriting if a file exists, a warning message displays asking permission to overwrite.
- [x] You can now change the menu icon to any Lucide icon available in their library.
- [x] You can set the file extension to be used when converting the markdown to a blog post. The default is `.md` but you can change it to .`html`.
- [x] You can now set the output location of the converted file. The default is in a folder called html on the root of you vault.


## Contact me

If you have any questions or suggestions, feel free to contact me at billaking@gmail.com.

## Project location

https://github.com/billaking/markdown-to-blog-post

## File extension options

You can set the file extension to be used when converting the markdown to a blog post. The default is `.md` but you can change it to .`html`.