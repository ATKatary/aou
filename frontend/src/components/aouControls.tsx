import '../assets/css/controls.css'; 

interface AOUControlsProps extends React.PropsWithChildren<any> {
    title: string
}
export function AOUControls({title, ...props}: AOUControlsProps) {

    return (
        <div id="controls">
            <h1>{title}</h1>
            {props.children}
        </div>
    )
}