module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send("ROS is up")
    });
}