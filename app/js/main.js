/* jshint devel:true */
var vjIsLive = false;
var showingVj = false

function checkTwitch(){
  $.getJSON('https://api.twitch.tv/kraken/streams/datafruits.json?callback=?', function(data){
    if(data.stream == null) {
      console.log('no live VJ')
      vjIsLive = false;
      if(showingVj === true){
        hideVJ();
      }
    }else {
      console.log('live stream!')
      vjIsLive = true;
      if(showingVj === false){
        showVJ();
      }
    }
  });
}

function showVJ(){
  showingVj = true;
  $("#zolos").hide();
  $("#livestream").show();
}

function hideVJ(){
  showingVj = false;
  $("#zolos").show();
  $("#livestream").hide();
}

$(function(){
  //var socket = io('http://superchathotdog.herokuapp.com')
  var socket = io('http://localhost:8080');
  var connected = false;
  socket.on('connect', function(){
    socket.on('JOINED', function(data) {
      console.log(data.username + " joined the chat");
      addJoinedMessage(data.username);
    });
    socket.on('NEW_MSG', function(data) {
      console.log("message from " + data.username + ": " + data.message);
      addChatMessage(data);
    });
    socket.on('disconnect', function(){
      console.log('socket.io disconnected');
    });
    socket.on("LOGIN", function(){
      console.log('LOGIN');
      connected = true;
    });
  });

  function addChatMessage(data) {
    var new_message = $("<li class='message' />");
    var message = $("<span class='message-body'>");
    message.html(emojione.shortnameToImage(escapeHtml(data.message)));
    var username = $("<span class='username'>");
    username.text(data.username);
    new_message.append(username, message);
    $("#messages").append(new_message);
    $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
  }

  function addJoinedMessage(name) {
    var new_message = $("<li class='message' />");
    var message = $("<span class='message-body'>");
    message.html(emojione.shortnameToImage(" joined the chat :raising_hand:"));
    var username = $("<span class='username'>");
    username.text(name);
    new_message.append(username, message);
    $("#messages").append(new_message);
    $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
  }

  function isImage(string){
  }

  function addImage(url){
    var new_message = $("<li class='message' />");
    var message = $("<span class='message-body'>");
    var image = new Image();
    image.src = url;
    message.append($(image));
    new_message.append(message);
    $("#messages").append(new_message);
    $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
  }

  function cleanMessage(input){
    return $('<div/>').text(input).text();
  }

  function sendMessage(){
    var message = $("#input-message").val();
    message = cleanMessage(message)
    console.log('message: '+message);
    if(message && connected){
      socket.emit('SENT_MSG', message);
      $("#input-message").val('');
    }
  }

  $("#send-message").submit(function(event) {
    sendMessage();
    event.preventDefault();
  });

  $('#enter-chat').submit(function(event) {
    var nick = cleanMessage($('input[name=nick]').val().trim());
    console.log('emitting nick: '+nick);
    socket.emit('JOIN', nick);
    $("#enter-chat").hide();
    $("#send-message").show();
    $("#input-message").focus();
    event.preventDefault();
  });

  var stream = {
    mp3: "http://datafruits.streampusher.com:8000/datafruits.mp3",
    oga: "http://datafruits.streampusher.com:8000/datafruits.ogg"
  };

  var playButtonClicked = false;
  $("#radio-player").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", stream);
    },
    supplied: "mp3, oga",
    wmode: "window",
    playing: function(e) {
      $(".jp-loading").hide();
    },
    pause: function(e){
      $(this).jPlayer("clearMedia");
      $(this).jPlayer("setMedia", stream);
    },
    error: function(event) {
      console.log("jPlayer error: "+ event.jPlayer.error.type);

      if(playButtonClicked == true){
        $(this).jPlayer("setMedia", stream).jPlayer("play");
      }

      $("jp-pause").hide();
      $("jp-loading").hide();
    },
    waiting: function(e) {
      $(".jp-loading").show();
      $(".jp-play").hide();
      $(".jp-pause").hide();
    },
    loadeddata: function(e) {
      $(".jp-loading").hide();
    },
    solution: "html, flash",
    cssSelectorAncestor: "#jp_container"
  });

  setTimeout(function(){
    checkTwitch();
  }, 500);

  setInterval(function(){
    checkTwitch();
  }, 2500);

});
