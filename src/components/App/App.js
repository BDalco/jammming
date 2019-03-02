import React from 'react';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify.js';
import './App.css';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          searchResults: [],
          playlistName: 'New Play List',
          playlistTracks: []
      };
      // Binding methods to this object
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
    }
    addTrack(track) {
      let inPlaylist = false;
      this.state.playlistTracks.find(playlistTrack =>{
        if (playlistTrack.id === track.id) {
          inPlaylist = true;
          return;
        }
      })
      if (!inPlaylist) {
        const addTrack = this.state.playlistTracks;
        addTrack.push(track);
        this.setState({playlistTracks: addTrack});
      }
    }
    removeTrack(track) {
      if (this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
        this.setState({playlistTracks: this.state.playlistTracks.filter(removeTracks => removeTracks.id !== track.id)})
      }
    }
    updatePlaylistName(name) {
      this.setState({playlistName: name});
    }
    savePlaylist(playlistName) {
      const trackURIs = this.state.playlistTracks.map(track => track.uri)
      // Save playlist to Spotify
      Spotify.saveplaylist(this.state.playlistName, trackURIs);
      this.setState({playlistTracks: [], playlistName: 'New Play List'});
    }
    search(term) {
      Spotify.search(term).then(tracks => {
        this.setState({
          searchResults: tracks
        })
      });
    }
    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                	<SearchBar onSearch={this.search}/>
                	<div className="App-playlist">
                		<SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                		<Playlist playlistName={this.state.playlistName} 
                              playlistTracks={this.state.playlistTracks}
                              onNameChange={this.updatePlaylistName}
                              onRemove={this.removeTrack} 
                              onSave={this.savePlaylist}
                    />
                	</div>
                </div>
            </div>
        );
    }
}

export default App;
