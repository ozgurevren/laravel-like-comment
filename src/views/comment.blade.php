<?php
$GLOBALS['commentDisabled'] = "";
if(!Auth::check())
    $GLOBALS['commentDisabled'] = "disabled";
$GLOBALS['commentClass'] = -1;
$GLOBALS['autoShow'] = (config('laravelLikeComment.autoShowComments')) ? 'true' : 'false';
$GLOBALS['maxCommentLength'] = config('laravelLikeComment.maxCommentLength');
?>
<div class="laravelComment" id="laravelComment-{{ $comment_item_id }}">
    <h3 class="ui dividing header">Comments</h3>
    <div class="ui threaded comments" id="{{ $comment_item_id }}-comment-0">
        <button class="ui basic small submit button dividing header" id="write-comment" data-form="#{{ $comment_item_id }}-comment-form">Write comment</button>
        <form class="ui laravelComment-form form" id="{{ $comment_item_id }}-comment-form" data-parent="0" data-item="{{ $comment_item_id }}" style="display: none;">
            <div class="field">
                <textarea id="0-textarea" rows="2" maxlength="{{$GLOBALS['maxCommentLength']}}" {{ $GLOBALS['commentDisabled'] }}></textarea>
                @if(!Auth::check())
                    <small>Please Log in to comment</small>
                @else
                    <small><span id="0-chars">{{$GLOBALS['maxCommentLength']}}</span> characters left</small>
                @endif
            </div>
            <input type="submit" class="ui basic small submit button" value="Comment" {{ $GLOBALS['commentDisabled'] }}>
        </form>
<?php
$GLOBALS['commentVisit'] = array();

function dfs($comments, $comment){
    $GLOBALS['commentVisit'][$comment->id] = 1;
    $GLOBALS['commentClass']++;
?>
    <div class="comment show-{{ $comment->item_id }}-{{ (int)($GLOBALS['commentClass'] / 5) }}" id="comment-{{ $comment->id }}">
        <a class="avatar">
            <img src="{{ $comment->avatar }}">
        </a>
        <div class="content">
            <a class="author" url="{{ $comment->url or '' }}"> {{ $comment->name }} </a>
            <div class="metadata">
                <span class="date">{{ $comment->updated_at->diffForHumans() }}</span>
            </div>
            <div class="text">
                {{ $comment->comment }}
            </div>
            <div class="actions">
                <a class="{{ $GLOBALS['commentDisabled'] }} reply reply-button" data-toggle="{{ $comment->id }}-reply-form" data-parent="{{ $comment -> id}}">Reply</a>
                {{ \risul\LaravelLikeComment\Controllers\CommentController::viewLike('comment-'.$comment->id) }}
            </div>
            
            <form id="{{ $comment->id }}-reply-form" class="ui laravelComment-form form" data-parent="{{ $comment->id }}" data-item="{{ $comment->item_id }}" style="display: none;">
                <div class="field">
                    <textarea id="{{ $comment->id }}-textarea" rows="2" {{ $GLOBALS['commentDisabled'] }}></textarea>
                    @if(!Auth::check())
                        <small>Please Log in to comment</small>
                    @else
                    <small><span id="{{ $comment->id }}-chars">{{$GLOBALS['maxCommentLength']}}</span> characters left</small>
                    @endif
                </div>
                <input type="submit" class="ui basic small submit button" value="Comment" {{ $GLOBALS['commentDisabled'] }}>
            </form>
        </div>
        <!--<div class="comments" id="{{ $comment->item_id }}-comment-{{ $comment->id }}"> -->
<?php
    $hasChild = 0;
    foreach ($comments as $isChild) {
        
        if($isChild -> parent_id == $comment -> id)
        {
            $hasChild = 1;
        }
    }
    if ($hasChild == 1){
        echo '<div class="comments" id="'.$comment->item_id.'-comment-'.$comment->id.'">';
    }

    foreach ($comments as $child) {

        if($child->parent_id == $comment->id && !isset($GLOBALS['commentVisit'][$child->id])){
            dfs($comments, $child);
            
        }
    }
    if ($hasChild == 1){
    echo "</div>";
    }
    echo "</div>";
}

$comments = \risul\LaravelLikeComment\Controllers\CommentController::getComments($comment_item_id);
foreach ($comments as $comment) {
    if(!isset($GLOBALS['commentVisit'][$comment->id])){
        dfs($comments, $comment);
    }
}
?>
    </div>
    <button class="ui basic button" id="showComment" data-auto-show="{{ $GLOBALS['autoShow'] }}" data-show-comment="0" data-item-id="{{ $comment_item_id }}">Show comments</button>
</div>
