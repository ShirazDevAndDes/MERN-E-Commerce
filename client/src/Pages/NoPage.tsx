import SEO from "../Components/SEO";

export default function NoPage() {
  return (
    <>
      <SEO title="404 Not Found" noIndex={true} />
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-bg-light fw-bold">
        <h1>404</h1>
        <h2>Not Found</h2>
      </div>
    </>
  );
}
