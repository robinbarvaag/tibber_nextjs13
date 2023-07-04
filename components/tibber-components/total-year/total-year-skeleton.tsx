import colors from "tailwindcss/colors";
import ProgressBar from "#/components/progressbar/progressbar";

async function TotalYearSkeleton(): Promise<JSX.Element> {
  return (
    <div className="col-span-6 flex flex-row justify-between">
      <div>
        <h2 className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-4"></h2>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-36 mb-4"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
      </div>
      <div>
        <div
          role="status"
          className="w-32 h-32 p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
        >
          <div className="flex h-full items-end space-x-1">
            <div className="w-full bg-gray-200 rounded-t-lg h-4/5 dark:bg-gray-700"></div>
            <div className="w-full h-5 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-4 dark:bg-gray-700"></div>
            <div className="w-full h-5 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-2 dark:bg-gray-700"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-4 dark:bg-gray-700"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-6 dark:bg-gray-700"></div>
          </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}
export default TotalYearSkeleton;
