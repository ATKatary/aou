import '../../assets/css/controls.css'; 

type ControlsProps = JSX.IntrinsicElements['div'] & {
    title: string
}

export function Controls({title, ...props}: ControlsProps) {

    return (
        <div id="controls">
            <h1>{title}</h1>
            {props.children}
        </div>
    )
}