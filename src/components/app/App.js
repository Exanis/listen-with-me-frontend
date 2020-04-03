import React from 'react';
import HeadBar from '../headbar/headbar';
import Login from '../login/login';
import './app.css';
import Player from '../player/player';
import Playlist from '../playlist/playlist';
import Settings from '../settings/settings';
import Search from '../search/search';
import Description from '../description/description';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: new WebSocket('wss://backend.listen-with-me.com/ws'),
      logged: false,
      roomName: '',
      isAdmin: false,
      roomKey: '',
      roomType: 'simple',
      playing: false,
      allowDownVote: false,
      removeThreshold: 3,
      limitPerUser: false,
      maxPerUser: 10,
      edit_roomName: '',
      edit_roomType: 'simple',
      edit_allowDownVote: false,
      edit_removeThreshold: 3,
      edit_limitPerUser: false,
      edit_maxPerUser: 10,
      canAdd: true,
      loginUserName: window.localStorage.getItem('user.name'),
      searchContent: '',
      roomId: window.location.pathname.replace('/', ''),
      displayParams: false,
      songs: [],
      results: null,
      player: null,
      users: []
    }
    this.state.socket.onmessage = this.onWSEvent;
    this.state.socket.onclose = () => alert('Connection au serveur perdue. Veuillez actualiser la page.');
    this.state.socket.onerror = () => alert('Connection au serveur perdue. Veuillez actualiser la page.');
  }

  onUserLogin = (event) => {
    event.preventDefault();
    const loginParams = {
      'action': 'login',
      'id': window.localStorage.getItem('user.id'),
      'name': window.localStorage.getItem('user.name')
    }
    
    if (loginParams.name === null) {
      loginParams.name = this.state.loginUserName;
      window.localStorage.setItem('user.name', this.state.loginUserName);
    }

    this.state.socket.send(JSON.stringify(loginParams));
    return false;
  }

  loginToRoom = () => {
    if (this.state.roomId) {
      this.state.socket.send(JSON.stringify({
        'action': 'join_room',
        'room': this.state.roomId
      }))
    } else {
      this.state.socket.send(JSON.stringify({
        'action': 'create_room'
      }));
    }
  }

  onWSEvent = (message) => {
    const data = JSON.parse(message.data);
    
    switch (data.action) {
      case 'set_id':
        window.localStorage.setItem('user.id', data.id);
        this.loginToRoom();
        break;
      case 'room_created':
        this.setState({
          roomId: data.key
        });
        this.state.socket.send(JSON.stringify({
          'action': 'join_room',
          'room': data.key
        }));
        break;
      case 'room_joined':
        this.setState({
          'logged': true,
          'roomName': data.name,
          'isAdmin': data.admin,
          'roomKey': data.key,
          'roomType': data.room_type,
          'allowDownVote': data.allow_downvote,
          'removeThreshold': data.downvote_threeshold,
          'limitPerUser': data.limit_per_user,
          'maxPerUser': data.max_per_user,
          'edit_roomName': data.name,
          'edit_roomType': data.room_type,
          'edit_allowDownVote': data.allow_downvote,
          'edit_removeThreshold': data.downvote_threeshold,
          'edit_limitPerUser': data.limit_per_user,
          'edit_maxPerUser': data.max_per_user
        });
        break;
      case 'room_updated':
        this.setState({
          'roomName': data.name,
          'roomType': data.room_type,
          'allowDownVote': data.allow_downvote,
          'removeThreshold': data.downvote_threeshold,
          'limitPerUser': data.limit_per_user,
          'maxPerUser': data.max_per_user,
          'edit_roomName': data.name,
          'edit_roomType': data.room_type,
          'edit_allowDownVote': data.allow_downvote,
          'edit_removeThreshold': data.downvote_threeshold,
          'edit_limitPerUser': data.limit_per_user,
          'edit_maxPerUser': data.max_per_user
        });
        break;
      case 'songs_list':
        this.setState({
          'songs': data.songs,
          'canAdd': data.can_add
        })
        break;
      case 'search_results':
        this.setState({
          results: data.result
        });
        break;
      case 'play':
        if (this.state.player) {
          this.state.player.loadVideoById({
            'videoId': data.id,
            'startSeconds': data.start
          });
          this.setState({
            playing: true
          });
        }
        break;
      case 'stop':
        if (this.state.player) {
          this.state.player.pauseVideo();
          this.setState({
            playing: false
          });
        }
        break;
      case 'join':
        this.setState({
          'users': this.state.users.concat([data.user])
        })
        break;
      case 'users':
        this.setState({
          'users': this.state.users.concat(data.list)
        });
        break;
      case 'leave':
        this.setState({
          'users': this.state.users.filter(el => el !== data.user)
        })
        break;
      default:
        console.log(data);
        break;
    }
  }

  onPlayerInit = (player) => {
    this.setState({
      'player': player
    });

    this.state.socket.send(JSON.stringify({'action': 'refresh'}));
  }

  onAddSong = (key, title) => {
    this.state.socket.send(JSON.stringify({
      'action': 'add_song',
      'key': key,
      'title': title
    }));
  }

  onLoginUsernameChange = (event) => {
    this.setState({
      loginUserName: event.target.value
    });
  }

  onSearchChange = (event) => {
    this.setState({
      searchContent: event.target.value
    });
  }

  onSearch = (event) => {
    event.preventDefault();
    console.log(this.state.socket.send(JSON.stringify({
      'action': 'search',
      'keyword': this.state.searchContent
    })));
  }

  onSettings = () => {
    this.setState({
      displayParams: true
    });
  }

  onClose = (event) => {
    event.preventDefault();
    this.setState({
      displayParams: false
    });
  }

  settingsFieldChange = (field) => (event) => {
    const change = {};

    change[field] = event.target.value;
    this.setState(change);
  }

  onAllowDownVoteChange = (event) => {
    this.setState({edit_allowDownVote: event.target.checked});
  }

  onLimitPerUserChange = (event) => {
    this.setState({edit_limitPerUser: event.target.checked});
  }

  onSettingsUpdate = (event) => {
    event.preventDefault();
    this.state.socket.send(JSON.stringify({
      'action': 'update_room',
      'name': this.state.edit_roomName,
      'allow_downvote': this.state.edit_allowDownVote,
      'downvote_threeshold': this.state.edit_removeThreshold,
      'room_type': this.state.edit_roomType,
      'max_per_user': this.state.edit_maxPerUser,
      'limit_per_user': this.state.edit_limitPerUser
    }));
    this.setState({displayParams: false});
  }

  onUpVote = (id) => {
    this.state.socket.send(JSON.stringify({
      'action': 'vote_song',
      'id': id
    }));
  }

  onDownVote = (id) => {
    this.state.socket.send(JSON.stringify({
      'action': 'downvote_song',
      'id': id
    }));
  }

  onDeleteSong = (id) => {
    this.state.socket.send(JSON.stringify({
      'action': 'delete_song',
      'id': id
    }));
  }

  onStop = () => {
    this.state.socket.send(JSON.stringify({
      'action': 'stop'
    }))
  }

  onStart = () => {
    this.state.socket.send(JSON.stringify({
      'action': 'play'
    }))
  }

  onNext = () => {
    this.state.socket.send(JSON.stringify({
      'action': 'skip'
    }))
  }

  render() {
    if (this.state.logged) {
      return (
        <div className="App">
          <HeadBar 
            title={this.state.roomName}
            search={this.state.searchContent}
            onSearchChange={this.onSearchChange}
            onSearch={this.onSearch}
            onSettings={this.onSettings}
            isAdmin={this.state.isAdmin}
            users={this.state.users}
            />

          <div className="main">
            <div className="left-part">
              <Player setPlayer={this.onPlayerInit} />
              <Playlist
                roomKey={this.state.roomKey}
                songs={this.state.songs}
                isAdmin={this.state.isAdmin}
                onUpVote={this.onUpVote}
                onDownVote={this.onDownVote}
                allowDownVote={this.state.allowDownVote}
                onDeleteSong={this.onDeleteSong}
                playing={this.state.playing}
                stop={this.onStop}
                start={this.onStart}
                next={this.onNext}
                />
            </div>
            <div className="right-part">
              <Search results={this.state.results} onAddSong={this.onAddSong} canAddSong={this.state.canAdd} />
            </div>
          </div>

          {this.state.displayParams && <Settings
            roomName={this.state.edit_roomName}
            roomType={this.state.edit_roomType}
            allowDownVote={this.state.edit_allowDownVote}
            removeThreshold={this.state.edit_removeThreshold}
            limitPerUser={this.state.edit_limitPerUser}
            maxPerUser={this.state.edit_maxPerUser}
            onRoomNameChange={this.settingsFieldChange('edit_roomName')}
            onRemoveThresholdChange={this.settingsFieldChange('edit_removeThreshold')}
            onRoomTypeChange={this.settingsFieldChange('edit_roomType')}
            onAllowDownVoteChange={this.onAllowDownVoteChange}
            onLimitPerUserChange={this.onLimitPerUserChange}
            onMaxPerUserChange={this.settingsFieldChange('edit_maxPerUser')}
            onSubmit={this.onSettingsUpdate}
            onClose={this.onClose}
           />}
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="outer">
            <Description />
            <Login login={this.state.loginUserName} onLoginChange={this.onLoginUsernameChange} onLogin={this.onUserLogin} />
          </div>
        </div>
      )
    }
  }
};

export default App;
