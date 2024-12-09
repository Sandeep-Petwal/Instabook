import LoginComponent from '../components/LoginComponent';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-3xl w-full">
        {/* Phone mockup */}
        <div className="hidden md:block w-[380px] relative">
          <div className=" rounded-[2.5rem] p-3">
            <img
              src="/sceenshot2.png"
              alt="Instagram mobile app"
              className="rounded-[2rem] w-full min-w-[350PX]"
            />
          </div>
        </div>

        {/* Login form */}
        <LoginComponent />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-zinc-500 text-xs">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
          <a href="#">Instabook</a>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Jobs</a>
          <a href="#">Help</a>
          <a href="#">API</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Locations</a>
          <a href="#">Instabook Lite</a>
          <a href="#">Contact Uploading & Non-Users</a>
          <a href="#">Instabook Verified</a>
        </div>
        <div className="flex items-center justify-center gap-4">
          <select className="bg-transparent text-zinc-500">
            <option value="en">English</option>
            <option value="en">ਪੰਜਾਬੀ</option>
            <option value="en">हिन्दी </option>
          </select>
          <span>© 2024 Instabook by Sandeep Prasad</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;