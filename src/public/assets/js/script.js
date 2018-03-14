$(document).ready(function(){
  if($('#showComment').data('auto-show'))
  {
    var show = $('#showComment').data("show-comment");
    $('.show-'+$('#showComment').data("item-id")+'-'+show).fadeIn('normal');
    $('#showComment').data("show-comment", show+1);
    $('#showComment').text("Show more");
  }
  
});

$('.laravelLike-icon').on('click', function(){
  if($(this).hasClass('disabled'))
    return false;

  var item_id = $(this).data('item-id');
  var vote = $(this).data('vote');

  $.ajax({
       method: "get",
       url: "/laravellikecomment/like/vote",
       data: {item_id: item_id, vote: vote},
       dataType: "json"
    })
    .done(function(msg){
      if(msg.flag == 1){
        if(msg.vote == 1){
          $('#'+item_id+'-like').removeClass('outline');
          $('#'+item_id+'-dislike').addClass('outline');
        }
        else if(msg.vote == -1){
          $('#'+item_id+'-dislike').removeClass('outline');
          $('#'+item_id+'-like').addClass('outline');
        }
        else if(msg.vote == 0){
          $('#'+item_id+'-like').addClass('outline');
          $('#'+item_id+'-dislike').addClass('outline');
        }
      $('#'+item_id+'-total-like').text(msg.totalLike == null ? 0 : msg.totalLike);
      $('#'+item_id+'-total-dislike').text(msg.totalDislike == null ? 0 : msg.totalDislike);
      }
    })
    .fail(function(msg){
    });
});

var maxLength = $('#0-textarea').attr('maxlength');

var length = 0;

$(document).on('click', '.reply-button', function(){
  $('#'+$(this).data('parent')+'-chars').text(maxLength);
  if($(this).hasClass("disabled"))
      return false;
  var toggle = $(this).data('toggle');
  $("#"+toggle).fadeToggle('normal');
});

$(document).on('submit', '.laravelComment-form', function(){
    var thisForm = $(this);
    var parent = $(this).data('parent');
    var item_id = $(this).data('item');
    var comment = $('textarea#'+parent+'-textarea').val();
    $.ajax({
         method: "get",
         url: "/laravellikecomment/comment/add",
         data: {parent: parent, comment: comment, item_id: item_id},
         dataType: "json"
      })
      .done(function(msg){
        $(thisForm).toggle('normal');
        var newComment = '<div class="comment" id="comment-'+msg.id+'"><a class="avatar"><img src="'+msg.userPic+'"></a><div class="content"><a class="author">'+msg.userName+'</a><div class="metadata"><span class="date">Today at 5:42PM</span></div><div class="text">'+msg.comment+'</div><div class="actions"><a class="reply reply-button" data-toggle="'+msg.id+'-reply-form">Reply</a></div><form class="ui laravelComment-form form" id="'+msg.id+'-reply-form" data-parent="'+msg.id+'" data-item="'+item_id+'" style="display: none;"><div class="field"><textarea id="'+msg.id+'-textarea" rows="2" maxlength="'+maxLength+'"></textarea><small><span id="'+msg.id+'-chars">'+maxLength+'</span> characters left</small></div><input type="submit" class="ui basic small submit button" value="Reply"></form></div><div class="ui threaded comments" id="'+item_id+'-comment-'+msg.id+'"></div></div>';
        if($('#'+item_id+'-comment-'+parent).length == 0)
        {
          $('#comment-'+parent).append('<div class="comments" id="'+item_id+'-comment-'+parent+'">');
        }
        $('#'+item_id+'-comment-'+parent).prepend(newComment);
        $('textarea#'+parent+'-textarea').val('');
      })
      .fail(function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
        if(comment == '')
        {
          alert('Please write something!');
        }
        else{
          alert('Unknown error!');
        }
      })
      .always(function(msg){
        /*$('#'+$(thisForm).data('parent')+'-chars').text(maxLength);*/
        $('#write-comment').show();
      })

    return false;
});


$(document).on('click', '#showComment', function(){
    var show = $(this).data("show-comment");
    $('.show-'+$(this).data("item-id")+'-'+show).fadeIn('normal');
    $(this).data("show-comment", show+1);
    $(this).text("Show more");
});

$(document).on('click', '#write-comment', function(){
    $('#'+$($(this).data("form")).data('parent')+'-chars').text(maxLength);
    $($(this).data("form")).show();
    $(this).hide();
    length = 0;
});



$(document).on('input', 'textarea', function() {
  length = $(this).val().length;
  remainingLength = maxLength-length;
  $('#'+$(this).parents('form:first').data('parent')+'-chars').text(remainingLength);
});
