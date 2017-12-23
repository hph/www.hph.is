export default function slashCoding(req, res, next) {
  if (req.url.startsWith('/coding')) {
    next();
  } else {
    res.redirect(`/coding${req.url === '/' ? '' : req.url}`);
  }
}
