import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

// common TrackList component shared by both SearchResult and Playlist, it is used to display tracks on
// from the list, different callbacks are passed from SearchResults and Playlist components, which will be
// further passed to the Track component
class TrackList extends React.Component {
	render() {
		return (
			<div className="TrackList">
			{
				this.props.tracks.map(track =>{
				return <Track key={track.id} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} />
			})
		}
	</div>);
	};
}

export default TrackList;