import loading from './loading.gif';
import noise from './noise.gif';

export default function VideoOutput(props)
{
    let isLoadingTemplate = (
        <div id="video_output">
            <img src={loading} alt='loading' />
        </div>
    );

    let notLoadingTemplate = (
        <div id="video_output">
            <img src={noise} alt='temp' id="lift" />
            <button id="download" disabled>Download Frames</button>
        </div>
    );

    return(props.isLoading ? isLoadingTemplate : notLoadingTemplate)
}



