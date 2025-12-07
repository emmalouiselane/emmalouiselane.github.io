const Bio = () => {
  const author = {
    name: "Emma Lane",
    summary: "a full stack developer based in Somerset; dabbling with different tech stacks and building (hopefully useful) things."
  };

  return (
    <div className="bio">
      <div className="bio-content">
        <img
          className="bio-avatar"
          src="/images/profile-pic.png"
          width={64}
          height={64}
          alt="Profile picture"
        />
        {author?.name && (
          <div className="bio-content-text">
            <p>
              Created by <strong>{author.name}</strong>, {author?.summary || null}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bio;
