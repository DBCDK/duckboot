import GlobalState from '../../GlobalState';
import React from 'react';

function ProfileView(profile) {
  const select = (e) => {
    e.preventDefault();
    GlobalState.selectProfile(profile)
    GlobalState.goto('search');
  };
  const remove = (e) => {
    e.preventDefault();
    GlobalState.deleteProfile(profile)
  };
  return (
    <article className="profile">
      <h2 className="mb1">{profile.name}</h2>
      <h3 className="mb0 gray">{profile.agencyId ? `Agency: ${profile.agencyId }` : ''}</h3>
      <h3 className="ratings mb1">
        {profile.ratings.filter(rating => rating.like).length} likes
        , {profile.ratings.filter(rating => !rating.like).length} dislikes
      </h3>
      <div className="profile-buttons">
        <button className="button remove" onClick={remove}>Slet profil</button>
        <button className="button submit" onClick={select}>Vælg profil</button>
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
      agencyId: refs.agencyId.value
    });
    refs.name.value = "";
    refs.agencyId.value = "";
  };
  return (
    <section className="profile">
      <form className="profile-create" onSubmit={addProfile} action="">
        <div className="form-group mb2">
          <input className="underline" ref={(ref) => refs.name = ref} type="text" id="name" placeholder="Navn"/>
        </div>
        <div className="form-group mb2">
          <input className="underline" ref={(ref) => refs.agencyId = ref} type="text" id="agency" placeholder="Agency ID"/>
        </div>
        <input className="button submit" type="submit" id="submit" value="opret profil"/>
      </form>
    </section>
  )

}

export default class Profiles extends React.Component {
  constructor() {
    super();
    const {profile, profiles} = GlobalState.getState();
    this.state = {profile, profiles};
  }

  componentDidMount() {
    this.listener = GlobalState.listen(({profiles, profile}) => {
      this.setState({profiles, profile});
    });
  }

  componentWillUnmount() {
    GlobalState.unListen(this.listener);
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

export class CurrentProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      profile: GlobalState.getState().profile || {}
    };
  }

  componentDidMount() {
    GlobalState.listen(({profile}) => {
      if (profile !== this.state.profile || profile.ratings !== this.state.profile.ratings) {
        this.setState({profile});
      }
    });
  }

  render() {
    const selectProfile = () => {
      GlobalState.goto('selectProfile');
    };
    return (
      <article className="black-box">
        <h2 className="mb1">{this.state.profile.name}</h2>
        <div className="ratings mb1">
          {this.state.profile.ratings.filter(rating => rating.like).length} likes
          , {this.state.profile.ratings.filter(rating => !rating.like).length} dislikes
        </div>
        <div>
          <button onClick={selectProfile}>Vælg anden profil</button>
        </div>
      </article>
    );
  }
}

