import { useEffect } from "react";
import { getNetwork } from "@root/util/const";

const App = () => {
  useEffect(() => {
    getNetwork();
  }, []);

  return (
    <div>
      <h1>TEST!!!!</h1>
    </div>
  );
};

export default App;