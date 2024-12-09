import { useInstaContext } from "@/hooks/useInstaContext";
import ChangePass from "./modal/ChangePass";
import { Bolt, Fingerprint, Info, Laptop, LogOutIcon, MessagesSquare } from "lucide-react";
import DeleteAcc from "./modal/DeleteAcc";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "./ui/button";
import { useState } from "react";

function Settings() {
  const [isDrawerOpen, setIsDrawerOpen] = useState();

  document.title = "Instabook - Settings";
  const { user, logout } = useInstaContext();
  console.log("Settings for user : " + user.user_id);

  return (
    <div className="w-full min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="flex items-center gap-2 text-white">
              <Bolt className="w-6 h-6 text-blue-500" />
              <span className="text-2xl">Settings</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-3">
              <ChangePass />


              <div className="group transition-all duration-200 hover:translate-x-1">
                <Link
                  to="/settings/2fa"
                  className="block w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600">
                      <Fingerprint className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-lg text-white">
                      Two factor authenticator
                    </span>
                  </div>
                </Link>
              </div>
              
              <div className="group transition-all duration-200 hover:translate-x-1">
                <Link
                  to="/settings/sessions"
                  className="block w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600">
                      <Laptop className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-lg text-white">Active Sessions</span>
                  </div>
                </Link>
              </div>

              <div className="group transition-all duration-200 hover:translate-x-1">
                <Link
                  to="/settings/support"
                  className="block w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600">
                      <MessagesSquare className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-lg text-white">Help center</span>
                  </div>
                </Link>
              </div>

              <DeleteAcc />

              <div className="group relative bottom-6 transition-all duration-200 hover:translate-x-1">
                <button
                  onClick={logout}
                  className="w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600">
                      <LogOutIcon className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-lg text-white">Logout</span>
                  </div>
                </button>
              </div>


              <div className="group relative bottom-6 transition-all duration-200 hover:translate-x-1">
                <Link
                  onClick={() => setIsDrawerOpen(true)}
                  className=" block w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600">
                      <Info className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-lg text-white">Info </span>
                  </div>
                </Link>
              </div>

              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="text-center">
                      {" "}
                      Information
                    </DrawerTitle>
                    <DrawerDescription className="m-4 text-center">
                      &copy; {new Date().getFullYear()} Instabook. All rights
                      reserved.
                      <br />
                      Made by{" "}
                      <span
                        // onClick={() => window.location = "https://www.sandeepprasad.tech/"}
                        className="text-blue-500 cursor-pointer hover:underline"
                      >
                        Sandeep
                      </span>
                    </DrawerDescription>
                  </DrawerHeader>

                  {/* <DrawerFooter>
                                        <DrawerClose>
                                            <Button variant="outline">Close</Button>
                                        </DrawerClose>
                                    </DrawerFooter> */}
                </DrawerContent>
              </Drawer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
