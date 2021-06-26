export function alert(msg: string | undefined) {
    if(typeof msg === "string") {
        return `<script type="text/javascript">alert("${msg}")</script>`;
    } else {
        return "";
    }
}