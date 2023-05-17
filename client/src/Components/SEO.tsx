import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "",
  description = "",
  keywords = "",
  name = "",
  type = "",
  noIndex = false,
}) {
  return (
    <Helmet>
      {noIndex && <meta name="robots" content="noindex"></meta>}
      {/* Standard metadata tags */}
      <link rel="icon" type="image/x-icon" href="/logo192.png"></link>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* End Facebook tags */}
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* End Twitter tags */}
    </Helmet>
  );
}
