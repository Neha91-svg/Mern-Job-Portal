import { useParams } from "react-router-dom";

const ResumeViewer = () => {
  const { file } = useParams();

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Resume Viewer</h1>

      <iframe
        src={`http://localhost:5000/uploads/${file}`}
        title="Resume PDF"
        className="w-full h-[90vh] border rounded-lg"
      ></iframe>
    </div>
  );
};

export default ResumeViewer;
