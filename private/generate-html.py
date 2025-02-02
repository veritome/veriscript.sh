# Within './public/content' there is a tree of downloddable files.
# This script generates a file tree in HTML format and writes it to index.html
# The HTML is then used to display the file tree on the website for easy downloading.


import os
import re
import sys
import json


def capture_tree(root_dir):
    tree = {}
    for root, dirs, files in os.walk(root_dir):
        current_dir = tree
        for dir in root.split("/"):
            current_dir = current_dir.setdefault(dir, {})
        for file in files:
            current_dir[file] = None
    return tree


# Converts the file tree dictionary to HTML
def convertFileTreeToHTML(fileTree):
    # The HTML string
    html = ""

    # The recursive function to convert the file tree to HTML
    def convertToHTML(fileTree, depth):
        nonlocal html

        # Add the opening ul tag
        html += "<ul>"

        # Loop through the items in the file tree
        for key, value in fileTree.items():
            # If the value is None, it is a file
            if value is None:
                # Remove the .md extension from the filename
                filename = key[:-3]

                # Extract file format
                file_format = (
                    os.path.splitext(key)[1][1:] if os.path.splitext(key)[1] else ""
                )

                # Replace underscores with spaces and capitalize each word
                filename = re.sub(r"([a-z])([A-Z])", r"\1 \2", filename)
                filename = re.sub(r"_", r" ", filename)

                scriptPath = os.path.join(
                    "public", "content", *depth.split(os.sep), key
                )
                # Add the li tag with the link to the file
                html += (
                    f'<li class="listing">'
                    f'<i class="fa-regular fa-eye icon-right-padding" name="{scriptPath}"></i>'
                    f'<code name="{scriptPath}" data-file-format="{file_format}">'
                    f"{filename}"
                    f"</code>"
                    f'<i class="fa-regular fa-clipboard icon-left-padding" name="{scriptPath}"></i>'
                    f"</li>"
                )
            else:
                # Add the li tag with the folder name
                html += f"<li>{key}"

                # Recursively call the function to convert the subdirectory to HTML
                convertToHTML(value, os.path.join(depth, key))

                # Add the closing li tag
                html += "</li>"

        # Add the closing ul tag
        html += "</ul>"

    # Call the recursive function to convert the file tree to HTML
    convertToHTML(fileTree, "")

    return html


# Write prettified HTML to index.html
def writeHTMLToIndex(html):
    # The path to the index.html file
    indexPath = os.path.join(os.getcwd(), "index.html")

    # Read the index.html file
    with open(indexPath, "r") as f:
        indexHTML = f.read()

    # Find the div with id "fileTreeContainer"
    match = re.search(r'<div id="fileTreeContainer">.*?</div>', indexHTML, re.DOTALL)

    if match:
        # Replace the div with the new HTML
        newIndexHTML = (
            indexHTML[: match.start()]
            + f'<div id="fileTreeContainer">{html}</div>'
            + indexHTML[match.end() :]
        )

        # Write the new HTML to the index.html file
        with open(indexPath, "w") as f:
            f.write(newIndexHTML)
    else:
        print("Error: Could not find div with id 'fileTreeContainer' in index.html")
        sys.exit(1)


def main():
    tree_structure = capture_tree("public/content")["public"]["content"]
    html = convertFileTreeToHTML(tree_structure)
    writeHTMLToIndex(html)


if __name__ == "__main__":
    main()
