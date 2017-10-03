console.clear();
var model = {
  input: "",//any input in the search box
  entry: "",//value of search box on 'enter' press
  streamsUrl: "https://api.twitch.tv/kraken/streams/",
  userName: ["freecodecamp", "GeoffStorbeck", "terakilobyte", "habathcx","notmichaelmcdonald","RobotCaleb","medrybw","comster404","brunofin","thomasballinger","joe_at_underflow","noobs2ninjas","mdwasp","beohoff","xenocomagain"],
  clientId: "mg8qnv3qjl9b8zfuv9j6ioddgq1v6ok",
  userData: {},//parsed ajax data 
  inputObj: {},//search box element
  enterObj: {},//enter button element
  sSelectObj: {},//all three channel sort buttons
  allObj: {},//all btn
  onlineObj: {},//online btn
  offlineObj: {},//offline btn
  refreshObj: {},//refresh btn
  disChnlObj: {},//displayChannels div
  channelObj: {},//dynamically added channel div 
  offlineEl: [],//
  onlineEl: [],
  dynamicEl: []
}//end of model

var m = model;//shorthand

var control = {
  init: function() {
    //prep static elements for user input
    this.addListener(m.inputObj, 'keypress');
    this.addListener(m.inputObj, 'keyup');
    this.addListener(m.enterObj, 'click');
    this.addListener(m.sSelectObj, 'click');
    //make initial api call
    m.userName.forEach(function(user) {
  c.XMLcall(m.streamsUrl, user)
});
    
  },
  //gather static elements
  searchField: m.inputObj = document.getElementById('searchField'),
  
  enterBtn: m.enterObj = document.getElementById('enterBtn'),
  
  statusSelector: m.sSelectObj =
  document.getElementById('sSelect'),
  
  allChannels: m.allObj = document.getElementById('allChannels'),
  
  online: m.onlineObj = document.getElementById('online'),
  
  offline: m.offlineObj = document.getElementById('offline'),
  
  refresh: m.refreshObj = { 
    button: document.getElementById('refresh'),
    icon: document.getElementById('refreshIcon')
                          },
  
  displayChannels: m.disChnlObj = document.getElementById('displayChannels'),
  
//process searches  
  getSearchVal: function(key) {
    if (key == 13 || key == m.enterObj) {
      m.entry = m.inputObj.value
      c.matchEntry();
    } else {
    m.input = m.inputObj.value
    c.match();
    }
  }, 
  
  //autocomplete search
  match: function(key) {    
    this.clearEls();
    //if search field is blank show all again
    if (!m.input.length)  {
      v.clickAll();
    }  else {
    //check input against usernames
    for (x=0; x<m.dynamicEl.length; x++) {
      if (m.dynamicEl[x][0].slice(0, m.input.length).toLowerCase() == m.input.toLowerCase()) {
    //don't rename online to offline & vice versa
        if (m.dynamicEl[x][1].className == 'channelDisplay online hide') {
          m.dynamicEl[x][1].className = 'channelDisplay online show'
        } else if (m.dynamicEl[x][1].className == 'channelDisplay offline hide') {
          m.dynamicEl[x][1].className = 'channelDisplay offline show'
        }       
      }//end of online of offline choice     
    }   
  }//end of dynamic search
  },//end of match
  
  //search for full term...will search beyond static user list
  matchEntry: function() {
    c.XMLcall(m.streamsUrl, m.entry)
    //clear input field
    m.inputObj.value = '';
  },
  
  //clear the showing channels
  clearEls: function() {
    //clear channels while searching
    for (x=0; x<m.disChnlObj.children.length; x++) {
      var el = m.disChnlObj.children[x].firstChild;
      if (el.className == 'channelDisplay online' || el.className == 'channelDisplay online show') {
        el.className = 'channelDisplay online hide';
      } else if (el.className == 'channelDisplay offline' || el.className == 'channelDisplay offline show') {       
        el.className = 'channelDisplay offline hide';
      }
    }   
  },
  //delete all dynamic elements
  deleteEls: function() {
    while (m.disChnlObj.firstChild) {
      m.disChnlObj.removeChild(m.disChnlObj.firstChild)
    }
  },
  
  //first api request
  XMLcall: function(url, user) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState==4 && xhttp.status==200) {
        var json = JSON.parse(this.responseText);  
        if (!json.stream) {        control.XMLcallOffline(json._links.channel)
        } else {
          var userCase = user.toLowerCase();
          var caseUserName = [];
        m.userName.forEach(function(name) {
          caseUserName.push(name.toLowerCase())
         });
          if (caseUserName.indexOf(userCase) == -1) {
            m.userName.push(user);
            alert(user + " is live and has been added to your user list")
          }
          control.useStreamData(json);       
        }//end of check if online
      }//end check if user exists    
      else if (xhttp.readyState==4) {
        
        v.displayNoAccount(user)
      }
    }//end onreadystatechange
    xhttp.open("GET", url + user, true)
    xhttp.setRequestHeader("client-Id", m.clientId)
    xhttp.send()
  },
  
  //new request if users aren't online
  XMLcallOffline: function(url){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState==4 && xhttp.status==200) {
        var json = JSON.parse(this.responseText);
        
        //check userName against search input
        var key = Object.keys(json)[3]
        if (key == 'display_name') {
          var caseCallUser = json[key].toLowerCase();
          var caseUserName = [];                 
          m.userName.forEach(function(name) {
            caseUserName.push(name.toLowerCase())
           });
          if (caseUserName.indexOf(caseCallUser) == -1) {
            m.userName.push(json[key]);
            alert(json[key] + " is not currently online but has been added to your user list")
          }
        }
        //call to create offline user channel
        control.useChannelData(json);
      }
    }//end readystatechange function
    xhttp.open("GET", url, true)
    xhttp.setRequestHeader("client-Id", m.clientId)
    xhttp.send()
  },
  
  useStreamData: function(json) {
    m.userData.state = "online";
    if (!json.stream.channel.logo) {
      m.userData.logo = "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_white.png"
      } else {
      m.userData.logo = json.stream.channel.logo;
    }
    m.userData.url = json.stream.channel.url;
    m.userData.views = json.stream.channel.views;
    m.userData.displayName = json.stream.channel.display_name;
    m.userData.followers = json.stream.channel.followers;
    m.userData.game = json.stream.game;
    m.userData.preview = json.stream.preview.medium;
    v.displayOnline();
  },
  
  useChannelData: function(json) {
    m.userData.state = "offline";
    m.userData.displayName = json.display_name;
    m.userData.followers = json.followers;
    if (!json.logo) {
      m.userData.logo = "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_white.png"
    } else {
      m.userData.logo = json.logo;
    }
    m.userData.url = json.url;
    m.userData.views = json.views;
    
    v.displayOffline();
  }, 
  
  //add listener to 'element' and call 'action' 
  addListener: function(element, type) {
    
    element.addEventListener(type, c.action) 
  },
  
  //add listeners to dynamically added channels
  addDynamicListeners: function(currentBtn) {
    //show info buttons if on touch screen
    if (typeof window.orientation !== 'undefined') {           
      currentBtn.className = 'show moreInfoBtn'
      c.addListener(currentBtn, 'click')
      
    } else {
      [].forEach.call(m.dynamicEl, function(el) {
        c.addListener(el[1], 'mouseenter');
        c.addListener(el[1], 'mouseleave');
      });   
    }
  },
  
  //find out what was clicked and what to do about it
  action: function(event) {
    switch (true) {
      case event.target == m.allObj:
        v.clickAll();
        break;
        
      case event.target == m.onlineObj:
        v.clickOnline();
        break;
        
      case event.target == m.offlineObj:
        v.clickOffline();
        break;
        
      case (event.target == m.refreshObj.button || event.target == m.refreshObj.icon):
        c.deleteEls();
        c.init();
        break;
        
      case event.type == 'mouseenter':
        v.showMoreInfoBtn(event.target);
        break;
        
      case event.type == 'mouseleave':
        v.hideMoreInfoBtn(event.target);
        break;
        
      case event.target == m.moreInfoBtn: 
        v.showMoreInfo(event.target)
        break;
        
        case event.type == 'click':   
        v.showMoreInfo(event.target)
        break;
      
      case event.type == 'keyup':
        c.getSearchVal(event.keyCode);
        break;
        
      case event.target == m.enterObj:
        c.getSearchVal(event.target);
        break;   
                 }//end of switch
  }//end of action function
  
}//end of control
var c = control

//VIEW OBJECT

var view = {
  //create div for online users
  displayOnline: function() {
    var d = m.userData;
    var div = document.createElement('div');
    var moreInfo = "<div class='hide moreStuff'>Followers: " + d.followers + " Views: " + d.views + "<br>Currently playing " + d.game + " <img src='" + d.preview + "' style='width:320px;height:180px;'></img></div>";
    var moreInfoBtn = "<div class='hide moreInfoBtn'>I</div>" + moreInfo;  
    var html = "<div class='channelDisplay online'><img src='" + d.logo + "' alt='logo missing'></img><a href='" + d.url + "' target='_blank'><h2>" + d.displayName + "</h2></a><div class='greenBox'></div>" + moreInfoBtn + "</div>";
    div.innerHTML = html
    m.disChnlObj.appendChild(div)
    //define user name and attached element and push to m.dynamicEl
    var online = document.getElementsByClassName('online');
    var nameAndEl = [d.displayName, online[online.length-1]]
    m.dynamicEl.push(nameAndEl);
    var infoBtn = document.getElementsByClassName('moreInfoBtn');
    var currentInfoBtn = infoBtn[infoBtn.length-1];
    c.addDynamicListeners(currentInfoBtn);
  },
  
  //create div for offline users
  displayOffline: function() {
    var d = m.userData;
    var div = document.createElement('div');
    var moreInfo = "<div class='hide moreStuff'>Followers: " + d.followers + " Views: " + d.views + "</div>";
    var moreInfoBtn = "<div class='hide moreInfoBtn'>I</div>" + moreInfo;  
    var html = "<div class='channelDisplay offline'><img src='" + d.logo + "' alt='logo missing'></img><a href='" + d.url + "' target='_blank'><h2>" + d.displayName + "</h2></a><div class='redBox'></div>" + moreInfoBtn + "</div>";
    div.innerHTML = html
    m.disChnlObj.appendChild(div)
    //define user name and attached element and push to m.dynamicEl
    var offline = document.getElementsByClassName('offline');
    var nameAndEl = [d.displayName, offline[offline.length-1]]
    m.dynamicEl.push(nameAndEl);
    var infoBtn = document.getElementsByClassName('moreInfoBtn');
    var currentInfoBtn = infoBtn[infoBtn.length-1];
    
    c.addDynamicListeners(currentInfoBtn);
  },
  
  //create div for no account users
  displayNoAccount: function(user) {
    var logo = "http://s.jtvnw.net/jtv_user_pictures/hosted_images/GlitchIcon_white.png";
    var div = document.createElement('div');
    var moreInfo = "<div class='hide moreStuff'>Followers: No Followers. Views: No Views</div>";
    var moreInfoBtn = "<div class='hide moreInfoBtn'>I</div>" + moreInfo;  
    var html = "<div class='channelDisplay offline'><img src='" + logo + "' alt='logo'></img><a href='" + "#" + "'><p>" + user + "<br>Account not active</p></a><div class='redBox'></div>" + moreInfoBtn + "</div>";
    div.innerHTML = html
    m.disChnlObj.appendChild(div)
    //define user name and attached element and push to m.dynamicEl
    var offline = document.getElementsByClassName('offline');
    var nameAndEl = [user, offline[offline.length-1]]
    m.dynamicEl.push(nameAndEl);
    var infoBtn = document.getElementsByClassName('moreInfoBtn');
    var currentInfoBtn = infoBtn[infoBtn.length-1];
    c.addDynamicListeners(currentInfoBtn); 
  },
  
  //show "all", "online" or "offline"
  clickAll: function() {
    [].forEach.call(m.dynamicEl, function(el) {
      
      if (el[1].className == 'channelDisplay online hide') {
      el[1].className = 'channelDisplay online show';
      } else if (el[1].className == 'channelDisplay offline hide') {
        el[1].className = 'channelDisplay offline show';      
      }   
    });
  },
  
  clickOnline: function() {
    [].forEach.call(m.dynamicEl, function(el) {
      if (el[1].className == 'channelDisplay online hide' || el[1].className == 'channelDisplay online') {
      el[1].className = 'channelDisplay online show';
      } else if (el[1].className == 'channelDisplay offline show' || el[1].className == 'channelDisplay offline') {
        
        el[1].className = 'channelDisplay offline hide';      
      }
    });
     
  },
  clickOffline: function() {
    [].forEach.call(m.dynamicEl, function(el) {
      if (el[1].className == 'channelDisplay offline hide' || el[1].className == 'channelDisplay offline') {
      el[1].className = 'channelDisplay offline show';
      } else if (el[1].className == 'channelDisplay online show' || el[1].className == 'channelDisplay online') {
        
        el[1].className = 'channelDisplay online hide';      
      }
    }); 
  },
  
  showMoreInfoBtn: function(el) {   
    var children = el.children;
    m.moreInfoBtn = children[3];
    m.moreInfoBtn.className = 'show moreInfoBtn'
    c.addListener(m.moreInfoBtn, 'click');
    
  },
  
  hideMoreInfoBtn: function(el) {
    var children = el.children;
    m.moreInfoBtn = children[3];
    m.moreInfoBtn.className = 'hide moreInfoBtn'
  },
  
  showMoreInfo: function(el) {
    var sib = el.nextSibling;
    if (sib.className == 'hide moreStuff') {
    sib.className = 'show moreStuff';
    } else {
      sib.className ='hide moreStuff';
    }
  }
}
var v = view;
c.init()