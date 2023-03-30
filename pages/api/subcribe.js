import api from "services/api";

export default function handler(req, res) {
  try {
    let data = req.body
    api.post("sendInfoSupport", { context: data })
    res.writeHead(302, {
      'Location': "/"
    });
    res.end();
  } catch (error) {
    console.log(error)
  }
}