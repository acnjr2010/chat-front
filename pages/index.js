import React, { useState } from 'react'
import { io } from 'socket.io-client'
import { Container, Box, TextField, Grid, IconButton, Card, CardContent, Typography } from "@mui/material"
import { makeStyles, createStyles } from "@mui/styles"
import SendIcon from '@mui/icons-material/Send';
import { Scrollbars } from 'react-custom-scrollbars';

const socket = io("http://localhost:8000", { transports: ['websocket'] })

const useStyles = makeStyles((theme) => createStyles({
  chat: {
    width: '100%',
    height: '85%',
    backgroundColor: 'red'
  }
}))

export default function Home() {
  const styles = useStyles()
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [withName, setWithName] = useState(false)
  const [messages, setMessages] = useState([])


  const handlePost = (e) => {
    socket.emit("room", {post: name + ': ' + message})
    setMessage('')
  }

  const handleName = () => {
    setWithName(true)
  }

  socket.on("response", (data) => {
    setMessages([...messages, data])
  })

  return (
    <main>
      <Container>
      {
          withName &&
          <>
            <Box mt={2} mb={1} sx={{
              width: '100%',
              height: '550px',
              maxHeight: 550,
              backgroundColor: '#c0c0c0',
              '&:hover': {
                backgroundColor: '#c0c0c0',
                opacity: [0.9, 0.8, 0.7],
              },
            }}>
              <Scrollbars autoHide style={{ height: 550 }}>
                {
                  messages.length > 0 &&
                  messages.map((m) => (
                    <Box mb={2} ml={3} mr={3}> 
                      <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {m.post}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))
                }
              </Scrollbars>
            </Box>

            <form onSubmit={handlePost}>
              <Grid
                container
                spacing={0}
              >
                <Grid item xs={11}>
                  <TextField
                    id="standard-multiline-static"
                    label="Mensagem"
                    multiline
                    rows={3}
                    placeholder="Digite sua mensagem..."
                    variant="standard"
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                  />
                </Grid>

                <Grid xs={1}
                  alignItems="bottom"
                >
                  <IconButton className="iconbutton" aria-label="add an alarm" onClick={handlePost}>
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </form>
          </>
        }

        {
          !withName &&
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <Grid item>
              <form onSubmit={handleName}>
                <TextField 
                  id="standard-basic" 
                  label="Digite seu nome"
                  size="large"
                  variant="standard" 
                  placeholder="Seu nome" 
                  onChange={(e) => setName(e.target.value)}
                />
                <IconButton type="submit" className="iconbutton" aria-label="add an alarm" onClick={handleName}>
                  <SendIcon />
                </IconButton>
              </form>
            </Grid>   
            
          </Grid>
        }    

      </Container>
    </main>
  )
}