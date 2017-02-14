import GlobalState from '../GlobalState';
import React from 'react';
import './profile.container.css';

function ProfileView(profile) {
  const select = (e) => {
    e.preventDefault();
    GlobalState.selectProfile(profile)
  };
  const remove = (e) => {
    e.preventDefault();
    GlobalState.deleteProfile(profile)
  };
  return (
    <article className="profile">
      <h2 className="">{profile.name}</h2>
      <div className="ratings mb2">
        {profile.ratings.filter(rating => rating.like).length} likes,
        {profile.ratings.filter(rating => !rating.like).length} dislikes,
      </div>
      <div>
        <a href="#" onClick={remove}>Slet profil</a>
      </div>
      <div>
        <a href="#" onClick={select}>Vælg profil</a>
      </div>

    </article>
  )
}

function ProfileList({list, children}) {
  return (
    <div className="profile-list">
      <h2 className="f2">Vælg/opret en profil</h2>
      <section className="flex">
        {list.map(profile => <ProfileView key={profile.name} {...profile} />)}
        {children}
      </section>
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
    refs.name.value = "";
    refs.token.value = "";
  };
  return (
    <section className="profile">
      <form className="profile-create" onSubmit={addProfile} action="">
        <div className="form-group mb2">
          <input className="underline" ref={(ref) => refs.name = ref} type="text" id="name" placeholder="Navn"/>
        </div>
        <div className="form-group mb2">
          <input className="underline" ref={(ref) => refs.token = ref} type="text" id="token" placeholder="Token"/>
        </div>
        <input className="button submit" type="submit" id="submit" value="opret profil"/>
      </form>
    </section>
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
        <ProfileList list={this.state.profiles}>
          <CreateProfile />
        </ProfileList>
      </div>
    )
  }
}

