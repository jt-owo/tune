import * as React from 'react';

import './DropArea.scss';

interface FileData {
    name?: string;
    path?: string;
    type?: string;
}

class DropArea extends React.Component<any> {
    private dropRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
        const div = this.dropRef.current;

        div!.addEventListener('dragenter', this.dragEnter);
        div!.addEventListener('dragover', this.dragOver);
        div!.addEventListener('dragleave', this.dragLeave);
        div!.addEventListener('drop', this.drop);
    }

    dragEnter = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    dragOver = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    dragLeave = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    drop = (e: DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (e.dataTransfer?.files!.length > 0) {
            const file: FileData = {
                name: e.dataTransfer?.files[0].name,
                path: e.dataTransfer?.files[0].path,
                type: e.dataTransfer?.files[0].type,
            };

            // console.log(file);
        }
    };

    render() {
        return (
            <div ref={this.dropRef} className="drop-area">
                {this.props.children}
            </div>
        );
    }
}

export default DropArea;
