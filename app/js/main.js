/* jshint devel:true */

'use strict';

var vjIsLive = false;
var showingVj = false;

function radioTitle(){
  var url = $('#radio-player').data('icecast-json').toString();
  console.log(url);

  $.get(url, function(data){
    var title = data.icestats.source[0].title;
    console.log(title);
    $('.jp-title').html(title);
  });
}

function showVJ(){
  showingVj = true;
  $('#zolos').hide();
  $('#livestream').show();
}

function hideVJ(){
  showingVj = false;
  $('#zolos').show();
  $('#livestream').hide();
}

function checkTwitch(){
  $.getJSON('https://api.twitch.tv/kraken/streams/datafruits.json?callback=?', function(data){
    if(data.stream === null) {
      console.log('no live VJ');
      vjIsLive = false;
      if(showingVj === true){
        hideVJ();
      }
    }else {
      console.log('live stream!');
      vjIsLive = true;
      if(showingVj === false){
        showVJ();
      }
    }
  });
}

$(function(){
  var socket = new window.Phoenix.Socket("ws://localhost:4000/socket", {
    logger: function logger(kind, msg, data) {
      console.log(kind + ": " + msg, data);
    }
  });

  socket.connect({ user_id: "123" });
  var $messages = $("#messages");
  var $input = $("#input-message");
  var $username = $("#input-nick");

  socket.onOpen(function (ev) {
    return console.log("OPEN", ev);
  });
  socket.onError(function (ev) {
    return console.log("ERROR", ev);
  });
  socket.onClose(function (e) {
    return console.log("CLOSE", e);
  });

  var chan = socket.chan("rooms:lobby", {});

  chan.join().receive("ignore", function () {
    return console.log("auth error");
  }).receive("ok", function () {
    return console.log("join ok");
  }).after(10000, function () {
    return console.log("Connection interruption");
  });

  chan.onError(function (e) {
    return console.log("something went wrong", e);
  });

  chan.onClose(function (e) {
    return console.log("channel closed", e);
  });

  chan.on("new:msg", function (msg) {
    addChatMessage(msg);
  });

  chan.on("authorized", function (msg) {
    $('#enter-chat').hide();
    $('#send-message').show();
    $('#input-message').focus();
  });

  chan.on("notauthorized", function(msg) {
    alert(msg.error);
  });

  chan.on("user:authorized", function(msg) {
    addJoinedMessage(msg.user);
  });

  chan.on("user:entered", function (msg) {
    //user entered room, but nick not authorized yet
  });

  function addToUserList(username){
    var new_user = $('<li class="userlist-item" data-username="'+username+'" />');
    var message = $('<span>');
    message.html(emojione.shortnameToImage(escapeHtml(username)));
    new_user.append(message);
    $('ul#userlist').append(new_user);
  }

  function removeFromUserList(username){
    $('li.userlist-item[data-username='+username+']').remove();
  }

  function addChatMessage(data) {
    var new_message = $('<li class="message" />');
    var message = $('<span class="message-body">');
    message.html(emojione.shortnameToImage(escapeHtml(data.body).autoLink({ target: "_blank", })));
    var username = $('<span class="username">');
    username.html(emojione.shortnameToImage(escapeHtml(data.user)));
    new_message.append(username, message);
    $('#messages').append(new_message);
    $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
    if(isImage(data.body)) {
      addImage(data.body.match(imgRegex)[0]);
    }
  }

  function addJoinedMessage(name) {
    var new_message = $('<li class="message" />');
    var message = $('<span class="message-body">');
    message.html(emojione.shortnameToImage(' joined the chat :raising_hand:'));
    var username = $('<span class="username">');
    username.text(name);
    new_message.append(username, message);
    $('#messages').append(new_message);
    $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
  }

  function addLeftMessage(name) {
    var new_message = $('<li class="message" />');
    var message = $('<span class="message-body">');
    message.html(emojione.shortnameToImage(' left the chat :dash:'));
    var username = $('<span class="username">');
    username.text(name);
    new_message.append(username, message);
    $('#messages').append(new_message);
    $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
  }

  function isImage(url){
    return imgRegex.test(url);
  }

  function addImage(url){
    var new_message = $('<li class="message" />');
    var message = $('<span class="message-body">');
    var image = new Image();
    image.src = url;
    message.append($(image));
    new_message.append(message);
    $('#messages').append(new_message);
    $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
  }

  function cleanMessage(input){
    return $('<div/>').text(input).text();
  }

  function sendMessage(){
    var message = $('#input-message').val();
    message = cleanMessage(message);
    console.log('message: '+message);
    if(message){
      //socket.emit('SENT_MSG', message);
      chan.push("new:msg", { user: $username.val(), body: message });
      $('#input-message').val('');
    }
  }

  $('#send-message').submit(function(event) {
    sendMessage();
    event.preventDefault();
  });

  $('#enter-chat').submit(function(event) {
    var nick = cleanMessage($('input[name=nick]').val().trim());
    console.log('emitting nick: '+nick);
    //socket.emit('JOIN', nick);
    chan.push("authorize", { user: nick });
    event.preventDefault();
  });

  var stream = {
    mp3: 'http://datafruits.streampusher.com:8000/datafruits.mp3',
    oga: 'http://datafruits.streampusher.com:8000/datafruits.ogg'
  };

  var playButtonClicked = false;
  $('#radio-player').jPlayer({
    ready: function () {
      $(this).jPlayer('setMedia', stream);
    },
    supplied: 'mp3, oga',
    wmode: 'window',
    playing: function(e) {
      $('.jp-loading').hide();
    },
    pause: function(e){
      $(this).jPlayer('clearMedia');
      $(this).jPlayer('setMedia', stream);
    },
    error: function(event) {
      console.log('jPlayer error: '+ event.jPlayer.error.type);

      if(playButtonClicked === true){
        $(this).jPlayer('setMedia', stream).jPlayer('play');
      }

      $('jp-pause').hide();
      $('jp-loading').hide();
    },
    waiting: function(e) {
      $('.jp-loading').show();
      $('.jp-play').hide();
      $('.jp-pause').hide();
    },
    loadeddata: function(e) {
      $('.jp-loading').hide();
    },
    solution: 'html, flash',
    cssSelectorAncestor: '#jp_container'
  });

  setTimeout(function(){
    checkTwitch();
  }, 500);

  setInterval(function(){
    checkTwitch();
  }, 2500);

  setTimeout(function(){
    radioTitle();
  }, 500);

  setInterval(function(){
    radioTitle();
  }, 10000);

  $('#calendar').ready(function(){
    var timeZone = jstz.determine();

    $('#calendar').fullCalendar({
      header: { left: 'prev,next today', center: 'title', right: 'month,basicWeek,basicDay'},
      defaultView: 'month',
      timezone: timeZone.name(),
      editable: true,
      eventSources: ["http://datafruits.streampusher.com/scheduled_shows.json"],
      eventClick: function(calEvent, jsEvent, view) {
        $("#eventModal h1").html("");
        $("#eventModal h2").html("");
        $("#eventModal .start-time").html("");
        $("#eventModal .end-time").html("");
        $("#eventModal .event-image").html("");

        $("#timetableModal").modal('hide');
        $("#eventModal h1").html(calEvent.title);
        $("#eventModal h2").html(calEvent.dj.username);
        $("#eventModal .start-time").html(calEvent.start.tz(timeZone.name()).format("ha z"));
        $("#eventModal .end-time").html(calEvent.end.tz(timeZone.name()).format('ha z'));
        var image = new Image();
        image.src = calEvent.image_url;
        $("#eventModal .event-image").append($(image));
        $("#eventModal").modal('show');
      }
    });
  });

  $("#timetableModal").on('shown.bs.modal', function(e) {
    $("#calendar").fullCalendar('render');
  });
});
