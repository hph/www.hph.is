export default function slashCoding(req, res, next) {
  if (req.url.startsWith('/coding') || req.url.startsWith('/calculator')) {
    next();
  } else {
    res.redirect(`/coding${req.url === '/' ? '' : req.url}`);
  }
}
