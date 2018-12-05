
// contents js in pages

$(function () {
  // add content
  $('#content-add-btn').on('click', function () {
    // 通过ajax提交请求
    
    // $('#html_container').wrapInner(simplemde.options.previewRender(simplemde.value()));
    
    // // const $codemirror = $('textarea[name="myTeatxarea"]').nextAll('.CodeMirror')[0].CodeMirror;
    // // // $codemirror.getDoc().setValue("Blaaaaaaaaaaaaaaaaaaaaaaaaa");

    // // console.log(codemirror);

    $.ajax({
      type: 'post',
      url: '/admin/content/add', // wait fix: /:username/content
      data: JSON.stringify({
        title: $('#title').val(),
        category: $( "#category option:selected" ).text(),
        description: $('#description').val(),
        description: $('#description').val(),
        content: $('#content').val()
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if(result.code == 0){
          console.log('success');
          $('#success-info').show()
          $('#success-info').html('Success! ')
        }else{
          if (result.message === 'Empty category'){
            $('#category-warning').show()
            $('#category-warning').html(result.message)
              setTimeout(function () {
                    $('#category-warning').hide()
            }, 1000)
          }
          if (result.message === 'Empty title'){
            $('#title-warning').show()
            $('#title-warning').html(result.message)
              setTimeout(function () {
                    $('#title-warning').hide()
            }, 1000)
          }
          if (result.message === 'Empty description'){
            $('#description-warning').show()
            $('#description-warning').html(result.message)
              setTimeout(function () {
                    $('#description-warning').hide()
            }, 1000)
          }
          if (result.message === 'Empty content'){
            $('#content-warning').show()
            $('#content-warning').html(result.message)
              setTimeout(function () {
                    $('#content-warning').hide()
            }, 1000)
          }
        }


        
      }
    })
  })


  // edit category
  $('#edit-category').find('button').on('click', function () {
    // 通过ajax提交请求

    $.ajax({
      type: 'put',
      url: '/admin/category/edit',

      data: JSON.stringify({
        name: $('#name-input').val(),
        id: $('#id-input').val(),
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if(result.code){ // error
          console.log(result);
          $('#submitwarning').show()
          $('#submitwarning').html(result.message)
          setTimeout(function () {
              $('#submitwarning').hide()
          }, 1000)
        } else{ // success
          $('#submitsuccess').show()
          window.location.reload()
        }

        
      }
    })
  })

})

