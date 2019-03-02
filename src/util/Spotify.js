const spotifyAuthorizeURIBase = 'https://accounts.spotify.com/authorize'
const spotifyAPIURIBase = 'https://api.spotify.com/v1/'
const clientId = '5fff2ccddb41490aa60d81e77525cdfc'
const redirectURI = 'http://localhost:3000/'

let userAccessToken;

const Spotify = {
	getAccessToken(){
		if (userAccessToken) {
			return userAccessToken;
		}
		const userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (userAccessTokenMatch && expiresInMatch) {
			userAccessToken = userAccessTokenMatch[1];
			const tokenExpiresIn = Number(expiresInMatch[1]);
			window.setTimeout(() => userAccessToken = '', tokenExpiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return userAccessToken;
		} else {
			const spotifyAuthorizeURI = `${spotifyAuthorizeURIBase}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
			window.location = spotifyAuthorizeURI;
		}
	},

	search(searchTerm) {
	  const userAccessToken = Spotify.getAccessToken();
		const searchRequest = `${spotifyAPIURIBase}search?type=track&q=${searchTerm}`
		return fetch(searchRequest, {
			headers: {
				Authorization: `Bearer ${userAccessToken}`
			}
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			if (!jsonResponse.tracks) {
				return [];
			}
			return jsonResponse.tracks.items.map(track => ({
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri
				}));
		});
	},

	saveplaylist(playlistName, trackUris) {
		const userAccessToken = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${userAccessToken}` }
		let userId;

		if (playlistName !=='' && trackUris!=='') {
			return fetch(`${spotifyAPIURIBase}me`, {headers: headers}
				).then(response => {
        	if (response.ok) {
          	return response.json();
        	} else {
        		console.log('failed get userID');
        	}
				}).then(jsonResponse => {
				userId = jsonResponse.id;
				return fetch(`${spotifyAPIURIBase}users/${userId}/playlists`, {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({name: playlistName})
				}).then(response => response.json()
				).then(jsonResponse => {
					const playlistId = jsonResponse.id;
					return fetch(`${spotifyAPIURIBase}users/${userId}/playlists/${playlistId}/tracks`, {
				    headers: headers,
				    method: 'POST',
				    body: JSON.stringify({uris: trackUris})
					});
				});
			});
		}
	}
}


export default Spotify