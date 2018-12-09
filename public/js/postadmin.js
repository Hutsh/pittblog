// contents js in pages

$(function() {
  $('#button-location').click(function(){
    console.log("location");
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position, err){

        console.log("Latitude: " + position.coords.latitude)
        console.log("Longitude: " + position.coords.longitude);
        var lat = position.coords.latitude;
        var lng = position.coords.longitude
        var res_city = ""
        var res_state = ""

        var key = "AYrApEKGTwuYJGUKqJdyPgwd3TobLvRo"
        var requrl = "http://www.mapquestapi.com/geocoding/v1/reverse?key=" + key + "&location=" + lat + "," + lng + "&"
        console.log("requrl=" + requrl);
        $.ajax({
            type: 'get',
            url: requrl,
            success: function(result) {
              console.log(result.results[0]);
              res_city = result.results[0].locations[0].adminArea5
              res_state = result.results[0].locations[0].adminArea3
              current_location = res_city + ", " + res_state
              $('#ipt-postLocation').val(current_location)
              $('#locationPreview').attr("src",result.results[0].locations[0].mapUrl).show();
            }
        })

      });
    }
    else{
      console.log("Geolocation is not supported by this browser.");
    }
  })

})



$(function() {

    initialValue = ($('#pre-content').val())? $('#pre-content').val() : "" 

    try {
        //editor
        var simplemde = new SimpleMDE({
            element: document.getElementById("fieldTest"),
            placeholder: "Input content. Markdown is supported.",
            initialValue: initialValue,
            spellChecker: false,
        });
    } catch (err) {
        console.log("no editor in page" + err);
    }


    // add content
    $('#content-add-btn').on('click', function() {

        console.log("getting editor content");
        var testPlain = simplemde.value();
        // testMarkdown = simplemde.markdown(testPlain);
        console.log("post addTime(frontEnd):" + new Date());

        $.ajax({
            type: 'post',
            url: '/admin/post',
            data: JSON.stringify({
                title: $('#title').val(),
                category: $("#category option:selected").text(),
                description: $('#description').val(),
                content: testPlain,
                location: $('#ipt-postLocation').val(),
                addTime: new Date()
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: function(result) {
                console.log(result);
                if (result.code == 0) {
                    console.log('success');
                    $('#addPostInfoModel').modal('show');
                    $('#success-info').show()
                    $('#success-info').html('Success! ')
                } else {
                    if (result.message === 'Empty category') {
                        $('#category-warning').show()
                        $('#category-warning').html(result.message)
                        setTimeout(function() {
                            $('#category-warning').hide()
                        }, 1000)
                    }
                    if (result.message === 'Empty title') {
                        $('#title-warning').show()
                        $('#title-warning').html(result.message)
                        $('#right-scorll').scrollTop($('#title-warning').offset().top)
                        setTimeout(function() {
                            $('#title-warning').hide()
                        }, 1000)
                    }
                    if (result.message === 'Empty description') {
                        $('#description-warning').show()
                        $('#description-warning').html(result.message)
                        $('#right-scorll').scrollTop($('#description-warning').offset().top)
                        setTimeout(function() {
                            $('#description-warning').hide()
                        }, 1000)
                    }
                    if (result.message === 'Empty content') {
                        $('#content-warning').show()
                        $('#content-warning').html(result.message)
                        $('#right-scorll').scrollTop($('#content-warning').offset().top)
                        setTimeout(function() {
                            $('#content-warning').hide()
                        }, 1000)
                    }
                }
            }
        })
    })


    //edit post PUT
    $('#post-edit-submit').on('click', function () {
      console.log("getting editor content");
      var testPlain = simplemde.value();
      // testMarkdown = simplemde.markdown(testPlain);
      // console.log("content:" + testPlain);
      console.log("post addTime(frontEnd):" + new Date());

      $.ajax({
        type: 'put',
        url: '/admin/post/' + $('#post-id-input').val(),
        data: JSON.stringify({
          title: $('#title').val(),
          category: $( "#category option:selected" ).text(),
          description: $('#description').val(),
          content: testPlain,
          location: $('#ipt-postLocation').val()
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {
          console.log(result);
          if(result.code == 0){
            console.log('success');

            $('#editPostInfoModel').modal('show');
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




})