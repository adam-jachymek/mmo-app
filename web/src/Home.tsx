import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { getUser } from "./api/endpoints";
import { createBookmark, getBookmarks } from "./api/endpoints";

const Home = () => {
  const {
    isFetching,
    data: user,
    refetch: refetchUser,
  } = useQuery("currentUser", getUser, { cacheTime: 0 });

  const { data: bookmarksData, refetch: refetchBookmarks } = useQuery(
    "getBookmarks",
    getBookmarks
  );

  const LogOut = () => {
    localStorage.removeItem("userToken");
    refetchUser();
  };

  const { mutate: addBookmark } = useMutation(createBookmark, {
    onSuccess: (response) => {
      refetchBookmarks();
    },
  });

  const bookmarkForm = useFormik({
    initialValues: {
      title: "",
      description: "",
      link: "",
    },
    onSubmit: (values) => {
      addBookmark(values);
    },
  });

  return (
    <div>
      <div>
        <p>{user?.email}</p>
        {user && <button onClick={LogOut}>Log Out</button>}
      </div>
      <div>
        <form onSubmit={bookmarkForm.handleSubmit}>
          <label className="main__label">Title</label>
          <input
            className="main__input"
            name="title"
            onChange={bookmarkForm.handleChange}
            value={bookmarkForm.values.title}
          />
          <label className="main__label">description</label>
          <input
            className="main__input"
            type="text"
            name="description"
            onChange={bookmarkForm.handleChange}
            value={bookmarkForm.values.description}
          />
          <label className="main__label">link</label>
          <input
            className="main__input"
            type="text"
            name="link"
            onChange={bookmarkForm.handleChange}
            value={bookmarkForm.values.link}
          />
          <button type="submit">Add bookmark</button>
        </form>
      </div>
      <div>
        <ul>
          {bookmarksData?.map((bookmark: any) => (
            <li>
              {bookmark.title}
              <p>{bookmark.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
