// $(document).ready(function() {
//   id = "editable";
//   md = "Please Input Content, **markdown** is supported  \nYou can use the tools above.";
//   var simplemde = new SimpleMDE({
//     element: $("textarea#" + id)[0],
//     initialValue: md,
//     toolbar: ["bold", "italic", "strikethrough", "heading", "heading-smaller", "heading-bigger", "|", "code", "quote", "unordered-list", "ordered-list", "clean-block", "|" ,"link", "image", "table", "horizontal-rule", "|" ,"preview", "side-by-side", "fullscreen"],
//     spellChecker: false,
//   });
//   html = simplemde.options.previewRender(md);
//   $('#html_container').wrapInner(html);

//   $("div#editor_container").css('display', 'inline');
//   simplemde.codemirror.refresh();
//   $('#html_container').empty();

//   $("content-add-btn").click(function() {
//     if (state) {
//       $("div#editor_container").css('display', 'none');
//       // Show markdown rendered by CodeMirror
//       $('#html_container').wrapInner(simplemde.options.previewRender(simplemde.value()));
//     } else {
//       // Show editor
//       $("div#editor_container").css('display', 'inline');
//       // Do a refresh to show the editor value
//       simplemde.codemirror.refresh();
//       $('#html_container').empty();
//     };
//   });


// });

// $(document).ready(function() {
//   state = false;
//   id = "editable";
//   md = "Outside the editor I am **HTML**.   \nAnd inside the editor you see me in **markdown**.   \nMake some edits and again click the button to see the changes as HTML. Wow!";
//   var simplemde = new SimpleMDE({
//     element: $("textarea#" + id)[0],
//     initialValue: md,
//   });
//   html = simplemde.options.previewRender(md);
//   $('#html_container').wrapInner(html);

//   $("content-add-btn").click(function() {
//     if (state) {
//       $("div#editor_container").css('display', 'none');
//       // Show markdown rendered by CodeMirror
//       $('#html_container').wrapInner(simplemde.options.previewRender(simplemde.value()));
//     } else {
//       // Show editor
//       $("div#editor_container").css('display', 'inline');
//       // Do a refresh to show the editor value
//       simplemde.codemirror.refresh();
//       $('#html_container').empty();
//     };
//     state = !state;
//   });
// });

// $(function () {
//   var simplemde = new SimpleMDE({
//          element: document.getElementById("fieldTest"),
//      });

//   $('#content-add-btn-markdown').click(function(){
//     console.log("getting editor content");
//     var testPlain = simplemde.value();
//     testMarkdown = simplemde.markdown(testPlain);
//     console.log("content:"+ testPlain);

//   })

// })

