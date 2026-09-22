import "../styles/TopRightMenu.css";

function TopRightMenu() {

  return (

    <div className="top-menu">

      <div className="notification">

        🔔

        <span className="badge">
          3
        </span>

      </div>

      <div className="profile">

        <div className="profile-avatar">
          R
        </div>

        <div className="profile-info">

          <h4>Rahul</h4>

          <p>Administrator</p>

        </div>

      </div>

    </div>

  );

}

export default TopRightMenu;