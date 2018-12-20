const urls = ['/coding', '/laun', '/launareiknivel', '/calculator'];
const urlsPattern = new RegExp(`^(${urls.join('|')})`);

export default function slashCoding(req, res, next) {
  if (req.url.match(urlsPattern)) {
    next();
  } else {
    res.redirect(`/coding${req.url === '/' ? '' : req.url}`);
  }
}
