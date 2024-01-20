export const joinRoom = (req, res) => {
    const { email, room } = req.body;
    console.log(email, room);
    res.status(200).json({ message: 'Room joined' });
}