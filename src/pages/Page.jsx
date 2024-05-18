import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getCategories,
  getFeaturedPlaylists,
  getNewReleasePodcasts,
  getToken,
} from "../services/spotify";
import PlaylistBox from "../components/boxes/PlaylistBox";
import PrimaryColorText from "../components/typography/PrimaryColorText";
import CategoryBox from "../components/boxes/CategoryBox";
import Loading from "../components/loading/Loading";
import GoBackButton from "../components/buttons/GoBackButton";

function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  let { title } = useParams();
  title = title.replace(/-/g, " "); // replace hyphens with spaces

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const location = useLocation();
  const dataType = location.state.dataType;

  useEffect(() => {
    getToken().then((access_token) => {
      switch (title) {
        case "New Release Playlists":
          getNewReleasePodcasts(access_token).then((playlists) => {
            setData(playlists);
            setLoading(false);
          });
          break;
        case "Categories":
          getCategories(access_token).then((categories) => {
            setData(categories);
            setLoading(false);
          });
          break;
        case "Popular Playlists":
          getFeaturedPlaylists(access_token).then((fPlaylists) => {
            setData(fPlaylists);
            setLoading(false);
          });
          break;
        default:
          setData(null);
          setLoading(true);
      }
    });
  }, [title]);
  console.log(data, "data");

  return (
    <div className="text-white px-20 py-10">
      <div className="flex justify-between items-center w-full">
        <PrimaryColorText text={title} ClassName={"text-3xl font-semibold"} />

        <GoBackButton onClick={goBack} />
      </div>

      {data && (
        <div>
          <div className="mt-6 grid grid-cols-6 gap-x-10 items-center">
            {dataType === "Categories" &&
              data.map((item) => {
                return (
                  <div className="my-5">
                    <CategoryBox data={item} key={item.id} />
                  </div>
                );
              })}
            {dataType === "Playlists" &&
              data.map((item) => {
                return (
                  <div className="my-5">
                    <PlaylistBox data={item} key={item.id} />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center w-full h-screen">
          <Loading />
        </div>
      )}
    </div>
  );
}

export default Page;
