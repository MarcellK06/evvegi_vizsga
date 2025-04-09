import CreateCommunityPost from "../Components/Community/CreateCommunityPost";
import LoadCommunityPosts from "../Components/Community/LoadCommunityPosts";
import AuthCheck from "../Components/Authentication/AuthCheck";
function Community() {
  return (
    <>
      <CreateCommunityPost />
      <LoadCommunityPosts />
    </>
  );
}

export default Community;
