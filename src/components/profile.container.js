import GlobalState from '../GlobalState';
import React from 'react';


function ProfileView(profile) {
  const select = (e) => {
    e.preventDefault();
    GlobalState.selectProfile(profile)
  };
  return (
    <div className="profile" onClick={select}>
      <h2>{profile.name}</h2>
      <span className="ratings">
        {profile.ratings.filter(rating => rating.like).length} likes,
        {profile.ratings.filter(rating => !rating.like).length} dislikes,
      </span>
    </div>
  )
}

function ProfileList({list}) {
  return (
    <div className="profile-list">
      {list.map(profile => <ProfileView key={profile.name} {...profile} />)}
    </div>
  )

}

function CreateProfile() {
  const refs = {};
  const addProfile = (e) => {
    e.preventDefault();
    GlobalState.addProfile({
      name: refs.name.value,
      token: refs.token.value
    });

  };
  return (
    <form onSubmit={addProfile} action="">
      <input ref={(ref) => refs.name = ref} type="text" id="name" placeholder="Navn"/>
      <input ref={(ref) => refs.token = ref} type="text" id="token" placeholder="Token"/>
      <input type="submit" id="submit" value="opret profil"/>
    </form>
  )

}



export default class Profiles extends React.Component {
  constructor() {
    super();
    this.state = {
      profiles: [],
      profile: {}
    };
    GlobalState.listen(({profiles, profile}) => {
     // TODO Fix ugly hack!
     if (profiles !== this.state.profiles || profile.ratings !== this.state.profile.ratings) {
        this.setState({profiles, profile: Object.assign({}, profile)});
      }
    });
  }

  render() {
    return (
      <div className="profiles">
        <ProfileList list={this.state.profiles} />
        <CreateProfile />
      </div>
    )
  }
}

