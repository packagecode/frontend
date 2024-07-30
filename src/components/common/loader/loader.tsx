// import { useEffect } from 'react';
import loader from "../../../assets/images/media/loader.svg";
const Loader = () => {
  // useEffect(() => {
  //   console.log("Working");

  // });
  const cdn = import.meta.env.VITE_APP_ASSET_URL;
  return (
    <div id="loader">
      <img src={`${cdn}${loader}`} className="loader-img" alt="Loader" />
    </div>
  );
};

export default Loader;
