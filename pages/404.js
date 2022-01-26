import appConfig from '../config.json';
import { Box, Image } from '@skynexui/components';

function Titulo(props) {
    const Tag = props.tag || 'h1';
    return (
      <Box
        styleSheet={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: appConfig.theme.colors.primary['400']
        }}
      >
        <Tag>{props.children}</Tag>
        <style jsx>{`
                ${Tag} {
                  color: ${appConfig.theme.colors.neutrals['999']};
                  font-size: 44px;
                  font-weight: 600;
                  text-align: center;
                  background: ${appConfig.theme.colors.primary['200']}; 
                  padding: 10px; 
                  border-radius: 30px;
                }
                `}</style>
      </Box>
    );
  }

export default function Page404() {
    return (
        <>
            <Titulo>Eita, parece que essa página não existe! :O</Titulo>
        </>
    )
}